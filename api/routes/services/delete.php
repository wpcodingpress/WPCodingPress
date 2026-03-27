<?php
/**
 * Delete Service API
 * POST /api/services/delete.php
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
    $sql = "SELECT id FROM services WHERE id = ? LIMIT 1";
    $service = dbFetchOne($sql, [$id]);
    
    if (!$service) {
        notFoundError('Service not found');
    }
    
    // Check if service has orders
    $sql = "SELECT COUNT(*) as count FROM orders WHERE service_id = ?";
    $result = dbFetchOne($sql, [$id]);
    
    if ($result['count'] > 0) {
        errorResponse('Cannot delete service with existing orders', 400);
    }
    
    // Delete service
    $sql = "DELETE FROM services WHERE id = ?";
    dbExecute($sql, [$id]);
    
    // Log the action
    logAPIRequest('/api/services/delete', 'POST', $current_user['id']);
    
    successResponse(null, 'Service deleted successfully');
    
} catch (Exception $e) {
    error_log("Delete Service Error: " . $e->getMessage());
    serverError('Failed to delete service');
}
