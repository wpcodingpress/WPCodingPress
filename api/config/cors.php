<?php
/**
 * CORS Configuration
 * WPCodingPress PHP API
 */

// Allowed origins (add your domains here)
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://wpcodingpress.com',
    'https://www.wpcodingpress.com',
    // Add Vercel domains when deployed
    'https://wpcodingpress.vercel.app',
    'https://*.vercel.app'
];

/**
 * Set CORS Headers
 */
function setCORSHeaders() {
    global $allowed_origins;
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Check if origin is allowed
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // For development, allow localhost
        if (strpos($origin, 'localhost') !== false) {
            header("Access-Control-Allow-Origin: $origin");
        }
    }
    
    // Other CORS headers
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // 24 hours
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Get client IP address
 */
function getClientIP() {
    $ip = '';
    
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

/**
 * Get request method
 */
function getRequestMethod() {
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

/**
 * Get request data (JSON or form data)
 */
function getRequestData() {
    $data = [];
    
    // Try JSON input
    $json = file_get_contents('php://input');
    if (!empty($json)) {
        $decoded = json_decode($json, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $data = $decoded;
        }
    }
    
    // Merge with POST data
    if (!empty($_POST)) {
        $data = array_merge($data, $_POST);
    }
    
    return $data;
}
