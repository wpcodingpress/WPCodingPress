<?php
/**
 * API Response Helpers
 * WPCodingPress PHP API
 */

/**
 * Send JSON Response
 */
function sendResponse($data = null, $message = '', $statusCode = 200) {
    http_response_code($statusCode);
    
    $response = [
        'success' => $statusCode >= 200 && $statusCode < 300,
        'message' => $message,
        'data' => $data,
        'timestamp' => time()
    ];
    
    // Remove null values
    $response = array_filter($response, function($value) {
        return $value !== null && $value !== '';
    });
    
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Success Response (200-299)
 */
function successResponse($data = null, $message = 'Success') {
    sendResponse($data, $message, 200);
}

/**
 * Created Response (201)
 */
function createdResponse($data = null, $message = 'Created successfully') {
    sendResponse($data, $message, 201);
}

/**
 * No Content Response (204)
 */
function noContentResponse() {
    http_response_code(204);
    exit();
}

/**
 * Error Response (400+)
 */
function errorResponse($message = 'Error', $statusCode = 400, $data = null) {
    sendResponse($data, $message, $statusCode);
}

/**
 * Validation Error (422)
 */
function validationError($errors) {
    sendResponse($errors, 'Validation failed', 422);
}

/**
 * Unauthorized Error (401)
 */
function unauthorizedError($message = 'Unauthorized') {
    sendResponse(null, $message, 401);
}

/**
 * Forbidden Error (403)
 */
function forbiddenError($message = 'Forbidden') {
    sendResponse(null, $message, 403);
}

/**
 * Not Found Error (404)
 */
function notFoundError($message = 'Not found') {
    sendResponse(null, $message, 404);
}

/**
 * Server Error (500)
 */
function serverError($message = 'Internal server error') {
    sendResponse(null, $message, 500);
}

/**
 * Validate Required Fields
 */
function validateRequired($data, $fields) {
    $errors = [];
    
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[$field] = ucfirst(str_replace('_', ' ', $field) . ' is required');
        }
    }
    
    return $errors;
}

/**
 * Sanitize String Input
 */
function sanitizeString($value) {
    if ($value === null) return '';
    
    $value = trim($value);
    $value = stripslashes($value);
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    
    return $value;
}

/**
 * Sanitize Email Input
 */
function sanitizeEmail($value) {
    return filter_var(trim($value), FILTER_SANITIZE_EMAIL);
}

/**
 * Validate Email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Paginate Results
 */
function paginate($page = 1, $perPage = 10) {
    $page = max(1, (int)$page);
    $perPage = min(100, max(1, (int)$perPage));
    $offset = ($page - 1) * $perPage;
    
    return [
        'page' => $page,
        'per_page' => $perPage,
        'offset' => $offset
    ];
}

/**
 * Build Pagination Response
 */
function buildPagination($total, $page, $perPage) {
    $totalPages = ceil($total / $perPage);
    
    return [
        'total' => (int)$total,
        'page' => (int)$page,
        'per_page' => (int)$perPage,
        'total_pages' => (int)$totalPages,
        'has_next' => $page < $totalPages,
        'has_prev' => $page > 1
    ];
}
