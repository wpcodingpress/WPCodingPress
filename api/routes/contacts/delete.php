<?php
/**
 * Delete Contact API
 * POST /api/contacts/delete.php
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
    
    // Delete contact
    $sql = "DELETE FROM contacts WHERE id = ?";
    dbExecute($sql, [$id]);
    
    // Log the action
    logAPIRequest('/api/contacts/delete', 'POST', $current_user['id']);
    
    successResponse(null, 'Contact deleted successfully');
    
} catch (Exception $e) {
    error_log("Delete Contact Error: " . $e->getMessage());
    serverError('Failed to delete contact');
}
