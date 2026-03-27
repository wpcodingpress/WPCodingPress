<?php
/**
 * Logout API
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../index.php';
require_once __DIR__ . '/middleware/verify-token.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    // Get current user (token is verified)
    $current_user = verifyToken();
    
    // Log the logout
    logAPIRequest('/api/auth/logout', 'POST', $current_user['id']);
    
    // For JWT, logout is handled client-side by removing the token
    // Optionally, you could blacklist the token in a database
    
    successResponse(null, 'Logout successful');
    
} catch (Exception $e) {
    error_log("Logout Error: " . $e->getMessage());
    errorResponse('Logout failed');
}
