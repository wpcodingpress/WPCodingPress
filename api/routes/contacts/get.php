<?php
/**
 * Get Contacts API
 * GET /api/contacts/get.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    // Verify token (admin only)
    $current_user = verifyToken();
    
    // Get query parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
    $unread_only = isset($_GET['unread']) && $_GET['unread'] === 'true';
    
    // Pagination
    $pagination = paginate($page, $per_page);
    
    // Build query
    $where = $unread_only ? "WHERE is_read = 0" : "";
    $order = "ORDER BY created_at DESC";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM contacts $where";
    $count_result = dbFetchOne($count_sql);
    $total = $count_result['total'];
    
    // Get contacts
    $sql = "SELECT * FROM contacts $where $order LIMIT ? OFFSET ?";
    $contacts = dbFetchAll($sql, [$pagination['per_page'], $pagination['offset']]);
    
    // Format contacts
    foreach ($contacts as &$contact) {
        $contact['is_read'] = (bool)$contact['is_read'];
        $contact['is_replied'] = (bool)$contact['is_replied'];
        $contact['created_at'] = date('Y-m-d H:i:s', strtotime($contact['created_at']));
    }
    
    successResponse([
        'contacts' => $contacts,
        'pagination' => buildPagination($total, $page, $per_page)
    ], 'Contacts retrieved');
    
} catch (Exception $e) {
    error_log("Get Contacts Error: " . $e->getMessage());
    errorResponse('Failed to get contacts');
}
