<?php
/**
 * Update Service API
 * POST /api/services/update.php
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
    validationError(['id' => 'Service ID is required']);
}

$id = (int)$data['id'];

try {
    // Check if service exists
    $sql = "SELECT * FROM services WHERE id = ? LIMIT 1";
    $service = dbFetchOne($sql, [$id]);
    
    if (!$service) {
        notFoundError('Service not found');
    }
    
    // Build update fields
    $fields = [];
    $values = [];
    
    // Optional fields to update
    $optional_fields = [
        'name', 'slug', 'description', 'icon',
        'basic_price', 'standard_price', 'premium_price',
        'basic_features', 'standard_features', 'premium_features',
        'sort_order', 'is_active'
    ];
    
    foreach ($optional_fields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            
            // Handle JSON fields
            if (in_array($field, ['basic_features', 'standard_features', 'premium_features'])) {
                $value = is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
            } elseif ($field === 'is_active') {
                $value = $data[$field] ? 1 : 0;
            } else {
                $value = sanitizeString($data[$field]);
            }
            
            $values[] = $value;
        }
    }
    
    // Check slug uniqueness if changed
    if (isset($data['slug']) && $data['slug'] !== $service['slug']) {
        $sql = "SELECT id FROM services WHERE slug = ? AND id != ? LIMIT 1";
        $existing = dbFetchOne($sql, [$data['slug'], $id]);
        
        if ($existing) {
            validationError(['slug' => 'Slug already exists']);
        }
    }
    
    if (empty($fields)) {
        validationError(['general' => 'No fields to update']);
    }
    
    // Add updated_at timestamp
    $fields[] = "updated_at = CURRENT_TIMESTAMP";
    $values[] = $id;
    
    // Update service
    $sql = "UPDATE services SET " . implode(', ', $fields) . " WHERE id = ?";
    dbExecute($sql, $values);
    
    // Fetch updated service
    $sql = "SELECT * FROM services WHERE id = ?";
    $updated_service = dbFetchOne($sql, [$id]);
    
    // Decode JSON fields
    $updated_service['basic_features'] = json_decode($updated_service['basic_features'] ?? '[]', true);
    $updated_service['standard_features'] = json_decode($updated_service['standard_features'] ?? '[]', true);
    $updated_service['premium_features'] = json_decode($updated_service['premium_features'] ?? '[]', true);
    $updated_service['is_active'] = (bool)$updated_service['is_active'];
    
    // Log the action
    logAPIRequest('/api/services/update', 'POST', $current_user['id']);
    
    successResponse($updated_service, 'Service updated successfully');
    
} catch (Exception $e) {
    error_log("Update Service Error: " . $e->getMessage());
    serverError('Failed to update service');
}
