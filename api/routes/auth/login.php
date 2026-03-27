<?php
/**
 * Login API
 * POST /api/auth/login.php
 */

require_once __DIR__ . '/../index.php';
require_once __DIR__ . '/../config/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Get request data
$data = getRequestData();

// Validate required fields
$errors = validateRequired($data, ['email', 'password']);
if (!empty($errors)) {
    validationError($errors);
}

$email = sanitizeEmail($data['email']);
$password = $data['password'];

// Validate email format
if (!isValidEmail($email)) {
    validationError(['email' => 'Invalid email format']);
}

try {
    // Find user by email
    $sql = "SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1";
    $user = dbFetchOne($sql, [$email]);
    
    if (!$user) {
        errorResponse('Invalid email or password', 401);
    }
    
    // Verify password
    if (!verifyPassword($password, $user['password'])) {
        errorResponse('Invalid email or password', 401);
    }
    
    // Generate JWT token
    $token = encodeJWT(createJWTPayload($user));
    $refresh_token = generateRefreshToken($user['id']);
    
    // Remove sensitive data
    unset($user['password']);
    
    // Log the login
    logAPIRequest('/api/auth/login', 'POST', $user['id']);
    
    // Return success response
    successResponse([
        'token' => $token,
        'refresh_token' => $refresh_token,
        'user' => $user,
        'expires_in' => JWT_EXPIRY
    ], 'Login successful');
    
} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    serverError('Login failed');
}
