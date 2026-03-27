<?php
/**
 * Get Current User API
 * GET /api/auth/me.php
 */

require_once __DIR__ . '/../index.php';
require_once __DIR__ . '/../middleware/verify-token.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    // Verify token and get current user
    $current_user = verifyToken();
    
    // Log the request
    logAPIRequest('/api/auth/me', 'GET', $current_user['id']);
    
    // Return user data
    successResponse($current_user, 'User retrieved');
    
} catch (Exception $e) {
    error_log("Me Error: " . $e->getMessage());
    errorResponse('Failed to get user');
}
