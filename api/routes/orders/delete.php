<?php
/**
 * Delete Order API
 * POST /api/orders/delete.php
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
    $sql = "SELECT id FROM orders WHERE id = ? LIMIT 1";
    $order = dbFetchOne($sql, [$id]);
    
    if (!$order) {
        notFoundError('Order not found');
    }
    
    // Delete order
    $sql = "DELETE FROM orders WHERE id = ?";
    dbExecute($sql, [$id]);
    
    // Log the action
    logAPIRequest('/api/orders/delete', 'POST', $current_user['id']);
    
    successResponse(null, 'Order deleted successfully');
    
} catch (Exception $e) {
    error_log("Delete Order Error: " . $e->getMessage());
    serverError('Failed to delete order');
}
