<?php
/**
 * Get Orders API
 * GET /api/orders/get.php
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
    $status = isset($_GET['status']) ? sanitizeString($_GET['status']) : null;
    
    // Pagination
    $pagination = paginate($page, $per_page);
    
    // Build query
    $where = "";
    $params = [];
    
    if ($status) {
        $where = "WHERE o.status = ?";
        $params[] = $status;
    }
    
    $order = "ORDER BY o.created_at DESC";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM orders o $where";
    $count_result = dbFetchOne($count_sql, $params);
    $total = $count_result['total'];
    
    // Get orders with service info
    $sql = "SELECT o.*, s.name as service_name, s.slug as service_slug 
            FROM orders o 
            LEFT JOIN services s ON o.service_id = s.id 
            $where $order 
            LIMIT ? OFFSET ?";
    
    $params[] = $pagination['per_page'];
    $params[] = $pagination['offset'];
    
    $orders = dbFetchAll($sql, $params);
    
    // Format orders
    foreach ($orders as &$order) {
        $order['created_at'] = date('Y-m-d H:i:s', strtotime($order['created_at']));
        $order['updated_at'] = date('Y-m-d H:i:s', strtotime($order['updated_at']));
    }
    
    successResponse([
        'orders' => $orders,
        'pagination' => buildPagination($total, $page, $per_page)
    ], 'Orders retrieved');
    
} catch (Exception $e) {
    error_log("Get Orders Error: " . $e->getMessage());
    errorResponse('Failed to get orders');
}
