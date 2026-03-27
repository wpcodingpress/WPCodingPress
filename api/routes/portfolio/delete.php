<?php
/**
 * Delete Portfolio API
 * POST /api/portfolio/delete.php
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
    $sql = "SELECT id FROM portfolio WHERE id = ? LIMIT 1";
    $item = dbFetchOne($sql, [$id]);
    
    if (!$item) {
        notFoundError('Portfolio item not found');
    }
    
    // Delete item
    $sql = "DELETE FROM portfolio WHERE id = ?";
    dbExecute($sql, [$id]);
    
    // Log the action
    logAPIRequest('/api/portfolio/delete', 'POST', $current_user['id']);
    
    successResponse(null, 'Portfolio item deleted successfully');
    
} catch (Exception $e) {
    error_log("Delete Portfolio Error: " . $e->getMessage());
    serverError('Failed to delete portfolio item');
}
