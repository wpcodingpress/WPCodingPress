<?php
/**
 * Refresh Token API
 * POST /api/auth/refresh.php
 */

require_once __DIR__ . '/../index.php';
require_once __DIR__ . '/../config/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$data = getRequestData();

// Get refresh token
$refresh_token = $data['refresh_token'] ?? extractBearerToken();

if (!$refresh_token) {
    errorResponse('Refresh token required', 401);
}

try {
    // Decode refresh token
    $payload = decodeJWT($refresh_token);
    
    if (!$payload) {
        errorResponse('Invalid refresh token', 401);
    }
    
    // Check if it's a refresh token
    if (!isset($payload['type']) || $payload['type'] !== 'refresh') {
        errorResponse('Invalid token type', 401);
    }
    
    // Fetch current user data
    $sql = "SELECT * FROM admin_users WHERE id = ? AND is_active = 1 LIMIT 1";
    $user = dbFetchOne($sql, [$payload['sub']]);
    
    if (!$user) {
        errorResponse('User not found', 401);
    }
    
    // Generate new tokens
    $token = encodeJWT(createJWTPayload($user));
    $new_refresh_token = generateRefreshToken($user['id']);
    
    successResponse([
        'token' => $token,
        'refresh_token' => $new_refresh_token,
        'user' => $user,
        'expires_in' => JWT_EXPIRY
    ], 'Token refreshed');
    
} catch (Exception $e) {
    error_log("Refresh Error: " . $e->getMessage());
    errorResponse('Token refresh failed', 401);
}
