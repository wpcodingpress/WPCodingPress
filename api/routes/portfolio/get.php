<?php
/**
 * Get Portfolio API
 * GET /api/portfolio/get.php
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
    $category = isset($_GET['category']) ? sanitizeString($_GET['category']) : null;
    $active_only = isset($_GET['active']) && $_GET['active'] === 'true';
    
    // Pagination
    $pagination = paginate($page, $per_page);
    
    // Build query
    $where = [];
    $params = [];
    
    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    
    if ($active_only) {
        $where[] = "is_active = 1";
    }
    
    $where_sql = !empty($where) ? "WHERE " . implode(' AND ', $where) : "";
    $order = "ORDER BY sort_order ASC, id DESC";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM portfolio $where_sql";
    $count_result = dbFetchOne($count_sql, $params);
    $total = $count_result['total'];
    
    // Get portfolio items
    $sql = "SELECT * FROM portfolio $where_sql $order LIMIT ? OFFSET ?";
    $params[] = $pagination['per_page'];
    $params[] = $pagination['offset'];
    
    $items = dbFetchAll($sql, $params);
    
    // Format items
    foreach ($items as &$item) {
        $item['technologies'] = json_decode($item['technologies'] ?? '[]', true);
        $item['is_active'] = (bool)$item['is_active'];
    }
    
    // Get unique categories
    $sql = "SELECT DISTINCT category FROM portfolio WHERE is_active = 1 ORDER BY category";
    $categories = dbFetchAll($sql);
    $categories = array_column($categories, 'category');
    
    successResponse([
        'portfolio' => $items,
        'categories' => $categories,
        'pagination' => buildPagination($total, $page, $per_page)
    ], 'Portfolio retrieved');
    
} catch (Exception $e) {
    error_log("Get Portfolio Error: " . $e->getMessage());
    errorResponse('Failed to get portfolio');
}
