<?php
/**
 * Create Order API (Public - No Auth Required)
 * POST /api/orders/create.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../config/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Get request data
$data = getRequestData();

// Validate required fields
$errors = validateRequired($data, ['service_id', 'client_name', 'client_email', 'client_phone']);
if (!empty($errors)) {
    validationError($errors);
}

$service_id = (int)$data['service_id'];
$client_name = sanitizeString($data['client_name']);
$client_email = sanitizeEmail($data['client_email']);
$client_phone = sanitizeString($data['client_phone']);
$package_type = sanitizeString($data['package_type'] ?? 'standard');
$message = sanitizeString($data['message'] ?? '');
$budget = sanitizeString($data['budget'] ?? '');

// Validate email format
if (!isValidEmail($client_email)) {
    validationError(['client_email' => 'Invalid email format']);
}

// Validate package type
$valid_packages = ['basic', 'standard', 'premium'];
if (!in_array($package_type, $valid_packages)) {
    validationError(['package_type' => 'Invalid package type']);
}

try {
    // Verify service exists
    $sql = "SELECT id, name FROM services WHERE id = ? AND is_active = 1 LIMIT 1";
    $service = dbFetchOne($sql, [$service_id]);
    
    if (!$service) {
        validationError(['service_id' => 'Service not found']);
    }
    
    // Insert order
    $sql = "INSERT INTO orders (service_id, client_name, client_email, client_phone, package_type, message, budget, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')";
    
    $order_id = dbInsert($sql, [
        $service_id,
        $client_name,
        $client_email,
        $client_phone,
        $package_type,
        $message,
        $budget
    ]);
    
    // Fetch created order
    $sql = "SELECT o.*, s.name as service_name, s.slug as service_slug 
            FROM orders o 
            LEFT JOIN services s ON o.service_id = s.id 
            WHERE o.id = ?";
    
    $order = dbFetchOne($sql, [$order_id]);
    
    $order['created_at'] = date('Y-m-d H:i:s', strtotime($order['created_at']));
    
    successResponse($order, 'Order submitted successfully');
    
} catch (Exception $e) {
    error_log("Create Order Error: " . $e->getMessage());
    serverError('Failed to create order');
}
