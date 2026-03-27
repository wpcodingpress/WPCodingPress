<?php
/**
 * Update Portfolio API
 * POST /api/portfolio/update.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Verify admin access
$current_user = verifyToken();
requireAdmin($current_user);

// Get request data
$data = getRequestData();

// Validate required fields
if (!isset($data['id']) || empty($data['id'])) {
    validationError(['id' => 'Portfolio ID is required']);
}

$id = (int)$data['id'];

try {
    // Check if item exists
    $sql = "SELECT * FROM portfolio WHERE id = ? LIMIT 1";
    $item = dbFetchOne($sql, [$id]);
    
    if (!$item) {
        notFoundError('Portfolio item not found');
    }
    
    // Build update fields
    $fields = [];
    $values = [];
    
    // Optional fields to update
    $optional_fields = [
        'title', 'category', 'image_url', 'thumbnail_url',
        'description', 'client', 'url', 'technologies',
        'sort_order', 'is_active'
    ];
    
    foreach ($optional_fields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            
            // Handle JSON fields
            if ($field === 'technologies') {
                $value = is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
            } elseif ($field === 'is_active') {
                $value = $data[$field] ? 1 : 0;
            } else {
                $value = sanitizeString($data[$field]);
            }
            
            $values[] = $value;
        }
    }
    
    // Add updated_at timestamp
    $fields[] = "updated_at = CURRENT_TIMESTAMP";
    $values[] = $id;
    
    if (empty($fields) - 1) { // -1 because we added updated_at
        validationError(['general' => 'No fields to update']);
    }
    
    // Update item
    $sql = "UPDATE portfolio SET " . implode(', ', $fields) . " WHERE id = ?";
    dbExecute($sql, $values);
    
    // Fetch updated item
    $sql = "SELECT * FROM portfolio WHERE id = ?";
    $updated_item = dbFetchOne($sql, [$id]);
    
    // Format item
    $updated_item['technologies'] = json_decode($updated_item['technologies'] ?? '[]', true);
    $updated_item['is_active'] = (bool)$updated_item['is_active'];
    
    // Log the action
    logAPIRequest('/api/portfolio/update', 'POST', $current_user['id']);
    
    successResponse($updated_item, 'Portfolio item updated successfully');
    
} catch (Exception $e) {
    error_log("Update Portfolio Error: " . $e->getMessage());
    serverError('Failed to update portfolio item');
}
