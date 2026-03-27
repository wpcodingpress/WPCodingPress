<?php
/**
 * API Bootstrap
 * WPCodingPress PHP API
 */

// Error reporting (enable for debugging)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Define base path
define('API_ROOT', __DIR__);

// Load configuration files
require_once API_ROOT . '/config/db.php';
require_once API_ROOT . '/config/cors.php';
require_once API_ROOT . '/config/jwt.php';
require_once API_ROOT . '/config/response.php';

// Set CORS headers
setCORSHeaders();

// Set default timezone
date_default_timezone_set('UTC');

// Get request info
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

// Remove /api prefix for routing
$api_prefix = '/api';
if (strpos($request_path, $api_prefix) === 0) {
    $request_path = substr($request_path, strlen($api_prefix));
}

// Log API request (optional)
function logAPIRequest($endpoint, $method, $user_id = null) {
    try {
        $data = [
            'endpoint' => $endpoint,
            'method' => $method,
            'ip_address' => getClientIP(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'user_id' => $user_id
        ];
        
        $sql = "INSERT INTO api_logs (endpoint, method, ip_address, user_agent, user_id) VALUES (?, ?, ?, ?, ?)";
        dbExecute($sql, [$endpoint, $method, $data['ip_address'], $data['user_agent'], $user_id]);
    } catch (Exception $e) {
        // Silent fail for logging
    }
}

// Return 404 for unknown routes
function routeNotFound() {
    notFoundError("Endpoint not found: " . ($_SERVER['REQUEST_URI'] ?? '/'));
}
