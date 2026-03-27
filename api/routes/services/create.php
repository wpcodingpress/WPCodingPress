<?php
/**
 * Create Service API
 * POST /api/services/create.php
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
$errors = validateRequired($data, ['name', 'slug', 'description']);
if (!empty($errors)) {
    validationError($errors);
}

$name = sanitizeString($data['name']);
$slug = sanitizeString($data['slug']);
$description = sanitizeString($data['description']);
$icon = sanitizeString($data['icon'] ?? 'code');
$basic_price = (int)($data['basic_price'] ?? 0);
$standard_price = (int)($data['standard_price'] ?? 0);
$premium_price = (int)($data['premium_price'] ?? 0);
$basic_features = is_array($data['basic_features'] ?? null) ? $data['basic_features'] : [];
$standard_features = is_array($data['standard_features'] ?? null) ? $data['standard_features'] : [];
$premium_features = is_array($data['premium_features'] ?? null) ? $data['premium_features'] : [];
$sort_order = (int)($data['sort_order'] ?? 0);
$is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;

// Validate slug format
if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
    validationError(['slug' => 'Slug must contain only lowercase letters, numbers, and hyphens']);
}

try {
    // Check if slug already exists
    $sql = "SELECT id FROM services WHERE slug = ? LIMIT 1";
    $existing = dbFetchOne($sql, [$slug]);
    
    if ($existing) {
        validationError(['slug' => 'Slug already exists']);
    }
    
    // Get max sort_order if not provided
    if ($sort_order === 0) {
        $sql = "SELECT MAX(sort_order) as max_order FROM services";
        $result = dbFetchOne($sql);
        $sort_order = ($result['max_order'] ?? 0) + 1;
    }
    
    // Insert service
    $sql = "INSERT INTO services (name, slug, description, icon, basic_price, standard_price, premium_price, basic_features, standard_features, premium_features, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $service_id = dbInsert($sql, [
        $name,
        $slug,
        $description,
        $icon,
        $basic_price,
        $standard_price,
        $premium_price,
        json_encode($basic_features),
        json_encode($standard_features),
        json_encode($premium_features),
        $sort_order,
        $is_active ? 1 : 0
    ]);
    
    // Fetch created service
    $sql = "SELECT * FROM services WHERE id = ?";
    $service = dbFetchOne($sql, [$service_id]);
    
    // Decode JSON fields
    $service['basic_features'] = json_decode($service['basic_features'] ?? '[]', true);
    $service['standard_features'] = json_decode($service['standard_features'] ?? '[]', true);
    $service['premium_features'] = json_decode($service['premium_features'] ?? '[]', true);
    $service['is_active'] = (bool)$service['is_active'];
    
    // Log the action
    logAPIRequest('/api/services/create', 'POST', $current_user['id']);
    
    createdResponse($service, 'Service created successfully');
    
} catch (Exception $e) {
    error_log("Create Service Error: " . $e->getMessage());
    serverError('Failed to create service');
}
