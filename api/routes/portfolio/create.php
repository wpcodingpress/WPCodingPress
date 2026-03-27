<?php
/**
 * Create Portfolio API
 * POST /api/portfolio/create.php
 */

require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/../../middleware/verify-token.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Verify admin access
$current_user = verifyToken();
requireAdmin($current_user);

// Get request data
$data = getRequestData();

// Validate required fields
$errors = validateRequired($data, ['title', 'category', 'image_url']);
if (!empty($errors)) {
    validationError($errors);
}

$title = sanitizeString($data['title']);
$category = sanitizeString($data['category']);
$image_url = sanitizeString($data['image_url']);
$thumbnail_url = sanitizeString($data['thumbnail_url'] ?? '');
$description = sanitizeString($data['description'] ?? '');
$client = sanitizeString($data['client'] ?? '');
$url = sanitizeString($data['url'] ?? '');
$technologies = is_array($data['technologies'] ?? null) ? $data['technologies'] : [];
$sort_order = (int)($data['sort_order'] ?? 0);
$is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;

try {
    // Get max sort_order if not provided
    if ($sort_order === 0) {
        $sql = "SELECT MAX(sort_order) as max_order FROM portfolio";
        $result = dbFetchOne($sql);
        $sort_order = ($result['max_order'] ?? 0) + 1;
    }
    
    // Insert portfolio item
    $sql = "INSERT INTO portfolio (title, category, image_url, thumbnail_url, description, client, url, technologies, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $item_id = dbInsert($sql, [
        $title,
        $category,
        $image_url,
        $thumbnail_url,
        $description,
        $client,
        $url,
        json_encode($technologies),
        $sort_order,
        $is_active ? 1 : 0
    ]);
    
    // Fetch created item
    $sql = "SELECT * FROM portfolio WHERE id = ?";
    $item = dbFetchOne($sql, [$item_id]);
    
    // Format item
    $item['technologies'] = json_decode($item['technologies'] ?? '[]', true);
    $item['is_active'] = (bool)$item['is_active'];
    
    // Log the action
    logAPIRequest('/api/portfolio/create', 'POST', $current_user['id']);
    
    createdResponse($item, 'Portfolio item created successfully');
    
} catch (Exception $e) {
    error_log("Create Portfolio Error: " . $e->getMessage());
    serverError('Failed to create portfolio item');
}
