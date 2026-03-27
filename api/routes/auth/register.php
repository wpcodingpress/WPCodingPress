<?php
/**
 * Register API
 * POST /api/auth/register.php
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
$errors = validateRequired($data, ['name', 'email', 'password']);
if (!empty($errors)) {
    validationError($errors);
}

$name = sanitizeString($data['name']);
$email = sanitizeEmail($data['email']);
$password = $data['password'];
$role = isset($data['role']) && $data['role'] === 'editor' ? 'editor' : 'viewer';

// Validate name
if (strlen($name) < 2 || strlen($name) > 100) {
    validationError(['name' => 'Name must be between 2 and 100 characters']);
}

// Validate email format
if (!isValidEmail($email)) {
    validationError(['email' => 'Invalid email format']);
}

// Validate password strength
if (strlen($password) < 6) {
    validationError(['password' => 'Password must be at least 6 characters']);
}

try {
    // Check if email already exists
    $sql = "SELECT id FROM admin_users WHERE email = ? LIMIT 1";
    $existing = dbFetchOne($sql, [$email]);
    
    if ($existing) {
        validationError(['email' => 'Email already registered']);
    }
    
    // Hash password
    $hashed_password = hashPassword($password);
    
    // Insert new user
    $sql = "INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)";
    $user_id = dbInsert($sql, [$name, $email, $hashed_password, $role]);
    
    // Fetch the created user
    $sql = "SELECT id, name, email, role, is_active, created_at FROM admin_users WHERE id = ?";
    $user = dbFetchOne($sql, [$user_id]);
    
    if (!$user) {
        serverError('Failed to create user');
    }
    
    // Generate JWT token
    $token = encodeJWT(createJWTPayload($user));
    $refresh_token = generateRefreshToken($user['id']);
    
    // Log registration
    logAPIRequest('/api/auth/register', 'POST', $user_id);
    
    // Return success response
    createdResponse([
        'token' => $token,
        'refresh_token' => $refresh_token,
        'user' => $user,
        'expires_in' => JWT_EXPIRY
    ], 'Registration successful');
    
} catch (Exception $e) {
    error_log("Register Error: " . $e->getMessage());
    serverError('Registration failed');
}
