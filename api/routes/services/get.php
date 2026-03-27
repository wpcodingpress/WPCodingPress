<?php
/**
 * Get Services API
 * GET /api/services/get.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    // Get query parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
    $active_only = isset($_GET['active']) && $_GET['active'] === 'true';
    
    // Pagination
    $pagination = paginate($page, $per_page);
    
    // Build query
    $where = $active_only ? "WHERE is_active = 1" : "";
    $order = "ORDER BY sort_order ASC, id DESC";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM services $where";
    $count_result = dbFetchOne($count_sql);
    $total = $count_result['total'];
    
    // Get services
    $sql = "SELECT * FROM services $where $order LIMIT ? OFFSET ?";
    $services = dbFetchAll($sql, [$pagination['per_page'], $pagination['offset']]);
    
    // Decode JSON fields
    foreach ($services as &$service) {
        $service['basic_features'] = json_decode($service['basic_features'] ?? '[]', true);
        $service['standard_features'] = json_decode($service['standard_features'] ?? '[]', true);
        $service['premium_features'] = json_decode($service['premium_features'] ?? '[]', true);
        $service['is_active'] = (bool)$service['is_active'];
    }
    
    // Get current user
    $current_user = verifyTokenOptional();
    
    successResponse([
        'services' => $services,
        'pagination' => buildPagination($total, $page, $per_page)
    ], 'Services retrieved');
    
} catch (Exception $e) {
    error_log("Get Services Error: " . $e->getMessage());
    errorResponse('Failed to get services');
}
