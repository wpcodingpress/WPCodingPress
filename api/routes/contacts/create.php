<?php
/**
 * Create Contact API (Public - No Auth Required)
 * POST /api/contacts/create.php
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
$errors = validateRequired($data, ['name', 'email', 'message']);
if (!empty($errors)) {
    validationError($errors);
}

$name = sanitizeString($data['name']);
$email = sanitizeEmail($data['email']);
$phone = sanitizeString($data['phone'] ?? '');
$subject = sanitizeString($data['subject'] ?? '');
$message = sanitizeString($data['message']);

// Validate email format
if (!isValidEmail($email)) {
    validationError(['email' => 'Invalid email format']);
}

// Validate message length
if (strlen($message) < 10) {
    validationError(['message' => 'Message must be at least 10 characters']);
}

try {
    // Insert contact
    $sql = "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
    
    $contact_id = dbInsert($sql, [$name, $email, $phone, $subject, $message]);
    
    // Fetch created contact
    $sql = "SELECT * FROM contacts WHERE id = ?";
    $contact = dbFetchOne($sql, [$contact_id]);
    
    $contact['created_at'] = date('Y-m-d H:i:s', strtotime($contact['created_at']));
    
    successResponse($contact, 'Message sent successfully');
    
} catch (Exception $e) {
    error_log("Create Contact Error: " . $e->getMessage());
    serverError('Failed to send message');
}
