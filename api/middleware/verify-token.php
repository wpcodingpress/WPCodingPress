<?php
/**
 * Token Verification Middleware
 * WPCodingPress PHP API
 */

require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/response.php';

/**
 * Verify JWT Token Middleware
 * 
 * Usage:
 * require_once 'middleware/verify-token.php';
 * 
 * After this, you can access:
 * - $current_user (array) - Current user data
 * - $current_user_id (int) - Current user ID
 */
function verifyToken() {
    $token = extractBearerToken();
    
    if (!$token) {
        unauthorizedError('No token provided');
    }
    
    $payload = decodeJWT($token);
    
    if (!$payload) {
        unauthorizedError('Invalid or expired token');
    }
    
    return $payload['user'];
}

/**
 * Verify Token (returns user or null, doesn't exit)
 */
function verifyTokenOptional() {
    $token = extractBearerToken();
    
    if (!$token) {
        return null;
    }
    
    $payload = decodeJWT($token);
    
    if (!$payload) {
        return null;
    }
    
    return $payload['user'];
}

/**
 * Require Admin Role
 */
function requireAdmin($user) {
    if (!isset($user['role']) || $user['role'] !== 'admin') {
        forbiddenError('Admin access required');
    }
    
    return true;
}

/**
 * Require Specific Roles
 */
function requireRole($user, $roles = []) {
    if (!isset($user['role']) || !in_array($user['role'], $roles)) {
        forbiddenError('Insufficient permissions');
    }
    
    return true;
}
