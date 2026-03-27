<?php
/**
 * JWT Configuration
 * WPCodingPress PHP API
 */

// JWT Secret Key (IMPORTANT: Change this in production!)
define('JWT_SECRET', 'wpcodingpress-jwt-secret-key-2024-secure-random-string');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRY', 86400 * 7); // 7 days
define('JWT_REFRESH_EXPIRY', 86400 * 30); // 30 days

/**
 * JWT Payload Structure
 */
function createJWTPayload($user) {
    $now = time();
    
    return [
        'iss' => 'wpcodingpress.com',
        'sub' => $user['id'],
        'iat' => $now,
        'exp' => $now + JWT_EXPIRY,
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ];
}

/**
 * Encode JWT Token
 */
function encodeJWT($payload) {
    $header = [
        'typ' => 'JWT',
        'alg' => JWT_ALGORITHM
    ];
    
    $header_encoded = base64UrlEncode(json_encode($header));
    $payload_encoded = base64UrlEncode(json_encode($payload));
    
    $signature = hash_hmac(
        'sha256',
        "$header_encoded.$payload_encoded",
        JWT_SECRET,
        true
    );
    $signature_encoded = base64UrlEncode($signature);
    
    return "$header_encoded.$payload_encoded.$signature_encoded";
}

/**
 * Decode and Verify JWT Token
 */
function decodeJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header_encoded, $payload_encoded, $signature_encoded) = $parts;
    
    // Verify signature
    $expected_signature = base64UrlEncode(
        hash_hmac(
            'sha256',
            "$header_encoded.$payload_encoded",
            JWT_SECRET,
            true
        )
    );
    
    if (!hash_equals($expected_signature, $signature_encoded)) {
        return false;
    }
    
    // Decode payload
    $payload = json_decode(base64UrlDecode($payload_encoded), true);
    
    if (!$payload) {
        return false;
    }
    
    // Check expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/**
 * Extract Token from Authorization Header
 */
function extractBearerToken() {
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (preg_match('/Bearer\s+(.+)$/i', $auth_header, $matches)) {
        return $matches[1];
    }
    
    return null;
}

/**
 * Base64 URL Safe Encoding
 */
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64 URL Safe Decoding
 */
function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Get Current User from Token
 */
function getCurrentUser() {
    $token = extractBearerToken();
    
    if (!$token) {
        return null;
    }
    
    $payload = decodeJWT($token);
    
    return $payload ? $payload['user'] : null;
}

/**
 * Generate Refresh Token
 */
function generateRefreshToken($user_id) {
    $now = time();
    $payload = [
        'iss' => 'wpcodingpress.com',
        'sub' => $user_id,
        'iat' => $now,
        'exp' => $now + JWT_REFRESH_EXPIRY,
        'type' => 'refresh'
    ];
    
    return encodeJWT($payload);
}

/**
 * Hash Password (using bcrypt)
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, [
        'cost' => 12
    ]);
}

/**
 * Verify Password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}
