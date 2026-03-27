<?php
/**
 * Update Order API
 * POST /api/orders/update.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Verify admin access
$current_user = verifyToken();

// Get request data
$data = getRequestData();

// Validate required fields
if (!isset($data['id']) || empty($data['id'])) {
    validationError(['id' => 'Order ID is required']);
}

$id = (int)$data['id'];

try {
    // Check if order exists
    $sql = "SELECT * FROM orders WHERE id = ? LIMIT 1";
    $order = dbFetchOne($sql, [$id]);
    
    if (!$order) {
        notFoundError('Order not found');
    }
    
    // Build update fields
    $fields = [];
    $values = [];
    
    // Optional fields to update
    $optional_fields = [
        'status', 'admin_notes'
    ];
    
    foreach ($optional_fields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $values[] = sanitizeString($data[$field]);
        }
    }
    
    // Add updated_at timestamp
    $fields[] = "updated_at = CURRENT_TIMESTAMP";
    $values[] = $id;
    
    // Update order if fields provided
    if (!empty($fields)) {
        $sql = "UPDATE orders SET " . implode(', ', $fields) . " WHERE id = ?";
        dbExecute($sql, $values);
    }
    
    // Fetch updated order with service info
    $sql = "SELECT o.*, s.name as service_name, s.slug as service_slug 
            FROM orders o 
            LEFT JOIN services s ON o.service_id = s.id 
            WHERE o.id = ?";
    
    $updated_order = dbFetchOne($sql, [$id]);
    
    $updated_order['created_at'] = date('Y-m-d H:i:s', strtotime($updated_order['created_at']));
    $updated_order['updated_at'] = date('Y-m-d H:i:s', strtotime($updated_order['updated_at']));
    
    // Log the action
    logAPIRequest('/api/orders/update', 'POST', $current_user['id']);
    
    successResponse($updated_order, 'Order updated successfully');
    
} catch (Exception $e) {
    error_log("Update Order Error: " . $e->getMessage());
    serverError('Failed to update order');
}
