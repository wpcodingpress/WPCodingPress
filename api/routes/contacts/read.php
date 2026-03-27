<?php
/**
 * Mark Contact as Read API
 * POST /api/contacts/read.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Verify admin access
$current_user = verifyToken();

// Get request data
$data = getRequestData();

// Validate required fields
if (!isset($data['id']) || empty($data['id'])) {
    validationError(['id' => 'Contact ID is required']);
}

$id = (int)$data['id'];

try {
    // Check if contact exists
    $sql = "SELECT id FROM contacts WHERE id = ? LIMIT 1";
    $contact = dbFetchOne($sql, [$id]);
    
    if (!$contact) {
        notFoundError('Contact not found');
    }
    
    // Mark as read
    $sql = "UPDATE contacts SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    dbExecute($sql, [$id]);
    
    // Fetch updated contact
    $sql = "SELECT * FROM contacts WHERE id = ?";
    $updated_contact = dbFetchOne($sql, [$id]);
    
    $updated_contact['is_read'] = (bool)$updated_contact['is_read'];
    $updated_contact['is_replied'] = (bool)$updated_contact['is_replied'];
    
    // Log the action
    logAPIRequest('/api/contacts/read', 'POST', $current_user['id']);
    
    successResponse($updated_contact, 'Contact marked as read');
    
} catch (Exception $e) {
    error_log("Mark Contact Read Error: " . $e->getMessage());
    serverError('Failed to mark contact as read');
}
