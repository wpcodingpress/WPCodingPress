<?php
/**
 * Plugin Name: Headless WP Connector (Enhanced)
 * Plugin URI: https://wpcodingpress.com
 * Description: Connect your WordPress site to WPCodingPress SaaS - Export data compatible with Next.js headless template
 * Version: 3.0.0
 * Author: WPCodingPress
 * Author URI: https://wpcodingpress.com
 * License: GPL v2 or later
 * Text Domain: headless-wp-connector
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HWPC_VERSION', '4.0.0');

register_post_meta('post', 'language', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

register_post_meta('post', 'translation_group_id', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

register_post_meta('post', 'view_count', [
    'type' => 'integer',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'intval'
]);

register_term_meta('category', 'language', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

register_term_meta('category', 'translation_group_id', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

register_term_meta('category', 'category_en_id', [
    'type' => 'integer',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'intval'
]);

register_term_meta('category', 'category_en_name', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

register_term_meta('category', 'category_en_slug', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
    'sanitize_callback' => 'sanitize_text_field'
]);

function hwpc_register_nav_menus() {
    register_nav_menus([
        'header_bn' => __('Header Menu (Bengali)'),
        'header_en' => __('Header Menu (English)'),
        'footer_bn' => __('Footer Menu (Bengali)'),
        'footer_en' => __('Footer Menu (English)'),
    ]);
}
add_action('after_setup_theme', 'hwpc_register_nav_menus');

add_action('after_setup_theme', function() {
    add_theme_support('post-thumbnails');
});

add_filter('rest_pre_serve_request', function($response) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    $allowed_origins = [
        'https://theeyepress.com',
        'http://localhost:3000',
        'http://localhost:3001'
    ];
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Authorization');
    return $response;
});

add_action('init', function() {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Authorization');
        header('Access-Control-Max-Age: 86400');
        header('Content-Length: 0');
        die();
    }
});

function hwpc_get_featured_image($post_id, $size = 'medium_large') {
    global $wpdb;
    
    $thumb_id = $wpdb->get_var($wpdb->prepare(
        "SELECT meta_value FROM $wpdb->postmeta WHERE post_id = %d AND meta_key = '_thumbnail_id'",
        $post_id
    ));
    
    if ($thumb_id) {
        $image_url = wp_get_attachment_image_url($thumb_id, $size);
        
        if (empty($image_url) || $image_url === false) {
            $image_url = $wpdb->get_var($wpdb->prepare(
                "SELECT guid FROM $wpdb->posts WHERE ID = %d AND post_type = 'attachment'",
                $thumb_id
            ));
        }
        
        $alt_text = get_post_meta($thumb_id, '_wp_attachment_image_alt', true);
        
        return [
            'id' => $thumb_id,
            'sourceUrl' => ($image_url && $image_url !== false) ? $image_url : null,
            'altText' => $alt_text ?: ''
        ];
    }
    
    return ['id' => null, 'sourceUrl' => null, 'altText' => ''];
}

function hwpc_translate_text($text, $target = 'en') {
    if (empty($text)) return $text;
    $url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=bn&tl=' . $target . '&dt=t&q=' . urlencode($text);
    $response = @file_get_contents($url);
    if ($response) {
        $result = json_decode($response, true);
        if ($result && isset($result[0])) {
            $translated = '';
            foreach ($result[0] as $item) {
                if (isset($item[0])) $translated .= $item[0];
            }
            return $translated;
        }
    }
    return $text;
}

function hwpc_bengali_to_english_slug($text) {
    if (empty($text)) return $text;
    
    $mapping = [
        'অ' => 'a', 'আ' => 'a', 'ই' => 'i', 'ঈ' => 'i', 'উ' => 'u', 'ঊ' => 'u', 'ঋ' => 'ri',
        'এ' => 'e', 'ঐ' => 'oi', 'ও' => 'o', 'ঔ' => 'ou',
        'ক' => 'k', 'খ' => 'kh', 'গ' => 'g', 'ঘ' => 'gh', 'ঙ' => 'ng',
        'চ' => 'ch', 'ছ' => 'chh', 'জ' => 'j', 'ঝ' => 'jh', 'ঞ' => 'n',
        'ট' => 't', 'ঠ' => 'th', 'ড' => 'd', 'ঢ' => 'dh', 'ণ' => 'n',
        'ত' => 't', 'থ' => 'th', 'দ' => 'd', 'ধ' => 'dh', 'ন' => 'n',
        'প' => 'p', 'ফ' => 'ph', 'ব' => 'b', 'ভ' => 'bh', 'ম' => 'm',
        'য' => 'j', 'র' => 'r', 'ল' => 'l', 'শ' => 'sh', 'ষ' => 'sh', 'স' => 's', 'হ' => 'h',
        'ড়' => 'r', 'ঢ়' => 'rh', 'য়' => 'y', 'ৎ' => 't',
        'া' => 'a', 'ি' => 'i', 'ী' => 'i', 'ু' => 'u', 'ূ' => 'u', 'ৃ' => 'ri',
        'ে' => 'e', 'ৈ' => 'oi', 'ো' => 'o', 'ৌ' => 'ou',
        '্' => '', '়' => '',
        '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4',
        '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9',
        ' ' => '-'
    ];
    
    $result = '';
    $text = strtolower($text);
    
    for ($i = 0; $i < strlen($text); $i++) {
        $char = $text[$i];
        if (isset($mapping[$char])) {
            $result .= $mapping[$char];
        } elseif (preg_match('/[a-z0-9]/', $char)) {
            $result .= $char;
        }
    }
    
    $result = preg_replace('/-+/', '-', $result);
    $result = trim($result, '-');
    
    return $result;
}

class Headless_WP_Connector {
    
    private $option_name = 'headless_wp_connector';
    private $api_key_option = 'hwpc_api_key';
    private $contacts_table;
    private $notifications_table;
    private $subscriptions_table;
    
    public function __construct() {
        global $wpdb;
        $this->contacts_table = $wpdb->prefix . 'eyepress_contacts';
        $this->notifications_table = $wpdb->prefix . 'eyepress_comment_notifications';
        $this->subscriptions_table = $wpdb->prefix . 'eyepress_subscriptions';
        
        register_activation_hook(__FILE__, [$this, 'create_tables']);
        register_activation_hook(__FILE__, [$this, 'register_post_types']);
        
        add_action('init', [$this, 'register_post_types']);
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'settings_init']);
        add_action('wp_insert_comment', [$this, 'track_new_comment'], 99, 2);
        add_action('transition_comment_status', [$this, 'track_comment_status_change'], 99, 3);
    }
    
    public function register_post_types() {
        // Custom post types removed - videos and ads are now configured via Settings page
    }
    
    public function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        $contacts_sql = "CREATE TABLE IF NOT EXISTS {$this->contacts_table} (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            subject varchar(255),
            message text NOT NULL,
            locale varchar(10) DEFAULT 'bn',
            status varchar(20) DEFAULT 'unread',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        $notif_sql = "CREATE TABLE IF NOT EXISTS {$this->notifications_table} (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            comment_id bigint(20) NOT NULL,
            post_id bigint(20) NOT NULL,
            post_slug varchar(255),
            post_title varchar(255),
            status varchar(20) NOT NULL,
            notification_read tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY email_idx (email),
            KEY comment_idx (comment_id)
        ) $charset_collate;";
        
        $sub_sql = "CREATE TABLE IF NOT EXISTS {$this->subscriptions_table} (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL UNIQUE,
            locale varchar(10) DEFAULT 'bn',
            status varchar(20) DEFAULT 'active',
            subscribed_at datetime DEFAULT CURRENT_TIMESTAMP,
            unsubscribed_at datetime DEFAULT NULL,
            PRIMARY KEY  (id),
            KEY email_idx (email)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($contacts_sql);
        dbDelta($notif_sql);
        dbDelta($sub_sql);
    }
    
    private function notification_table_exists() {
        global $wpdb;
        return $wpdb->get_var("SHOW TABLES LIKE '{$this->notifications_table}'") == $this->notifications_table;
    }
    
    public function track_new_comment($comment_id, $comment) {
        if (!$this->notification_table_exists()) return;
        
        global $wpdb;
        $email = $comment->comment_author_email;
        if (empty($email)) return;
        
        $post_id = $comment->comment_post_ID;
        $post = get_post($post_id);
        
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$this->notifications_table} WHERE comment_id = %d",
            $comment_id
        ));
        
        if (!$exists) {
            $wpdb->insert($this->notifications_table, [
                'email' => $email,
                'comment_id' => $comment_id,
                'post_id' => $post_id,
                'post_slug' => $post ? $post->post_name : '',
                'post_title' => $post ? $post->post_title : '',
                'status' => $comment->comment_approved,
                'notification_read' => 0
            ]);
        }
    }
    
    public function track_comment_status_change($new_status, $old_status, $comment) {
        if (!$this->notification_table_exists()) return;
        
        global $wpdb;
        $email = $comment->comment_author_email;
        if (empty($email)) return;
        
        $comment_id = $comment->comment_id;
        $post_id = $comment->comment_post_ID;
        $post = get_post($post_id);
        
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$this->notifications_table} WHERE comment_id = %d",
            $comment_id
        ));
        
        if ($exists) {
            $wpdb->update($this->notifications_table, 
                ['status' => $new_status, 'post_title' => $post ? $post->post_title : ''],
                ['comment_id' => $comment_id]
            );
        } else {
            $wpdb->insert($this->notifications_table, [
                'email' => $email,
                'comment_id' => $comment_id,
                'post_id' => $post_id,
                'post_slug' => $post ? $post->post_name : '',
                'post_title' => $post ? $post->post_title : '',
                'status' => $new_status,
                'notification_read' => 0
            ]);
        }
    }
    
    public function register_routes() {
        register_rest_route('eyepress/v1', '/posts', [
            'methods' => 'GET',
            'callback' => [$this, 'get_posts'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/post/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_post'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/pages', [
            'methods' => 'GET',
            'callback' => [$this, 'get_pages'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/page/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_page'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/categories', [
            'methods' => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/category/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_category_posts'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menus'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/menus/footer', [
            'methods' => 'GET',
            'callback' => [$this, 'get_footer_menu'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/site-options', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_options'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/search', [
            'methods' => 'GET',
            'callback' => [$this, 'search_posts'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_stats'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/ticker', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ticker'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/trending', [
            'methods' => 'GET',
            'callback' => [$this, 'get_trending'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/authors', [
            'methods' => 'GET',
            'callback' => [$this, 'get_authors'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/author/(?P<username>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_author_posts'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/translation/(?P<group_id>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_translation'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/post-translation/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_post_translation'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/videos', [
            'methods' => 'GET',
            'callback' => [$this, 'get_videos'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/ads', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ads'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [$this, 'submit_contact'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/guest-comment', [
            'methods' => 'POST',
            'callback' => [$this, 'submit_guest_comment'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/notifications', [
            'methods' => 'GET',
            'callback' => [$this, 'get_notifications'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/notifications/mark-read', [
            'methods' => 'POST',
            'callback' => [$this, 'mark_notifications_read'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/notifications/sync', [
            'methods' => 'POST',
            'callback' => [$this, 'sync_notifications'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/login', [
            'methods' => 'POST',
            'callback' => [$this, 'user_login'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/register', [
            'methods' => 'POST',
            'callback' => [$this, 'user_register'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/subscribe', [
            'methods' => 'POST',
            'callback' => [$this, 'subscribe'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/subscription-status', [
            'methods' => 'POST',
            'callback' => [$this, 'check_subscription'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/unsubscribe', [
            'methods' => 'POST',
            'callback' => [$this, 'unsubscribe'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/resubscribe', [
            'methods' => 'POST',
            'callback' => [$this, 'resubscribe'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/search-all', [
            'methods' => 'GET',
            'callback' => [$this, 'search_all'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/category-slugs', [
            'methods' => 'GET',
            'callback' => [$this, 'get_category_slugs'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('eyepress/v1', '/track-view', [
            'methods' => 'GET',
            'callback' => [$this, 'track_view'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('headless/v1', '/export', [
            'methods' => 'GET',
            'callback' => [$this, 'export_all_data'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('headless/v1', '/verify', [
            'methods' => 'GET',
            'callback' => [$this, 'verify_connection'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    public function check_api_key(WP_REST_Request $request) {
        $provided_key = $request->get_header('X-API-Key') ?: $request->get_param('api_key');
        if (!$provided_key) {
            return new WP_Error('no_api_key', 'API key is required', ['status' => 401]);
        }
        $stored_key = get_option($this->api_key_option);
        if (!$stored_key || !hash_equals($stored_key, $provided_key)) {
            return new WP_Error('invalid_api_key', 'Invalid API key', ['status' => 401]);
        }
        return true;
    }
    
    public function get_posts(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        $page = intval($request->get_param('page')) ?: 1;
        $per_page = intval($request->get_param('per_page')) ?: 20;
        $category = $request->get_param('category');
        
        $args = [
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'date',
            'order' => 'DESC',
        ];
        
        if ($category) {
            $args['category_name'] = $category;
        }
        
        $posts = get_posts($args);
        $formatted_posts = array_map([$this, 'format_post'], $posts);
        
        return rest_ensure_response($formatted_posts);
    }
    
    public function get_post(WP_REST_Request $request) {
        $slug = $request->get_param('slug');
        
        $posts = get_posts([
            'name' => $slug,
            'post_status' => 'publish',
            'posts_per_page' => 1,
        ]);
        
        if (empty($posts)) {
            return new WP_Error('not_found', 'Post not found', ['status' => 404]);
        }
        
        return rest_ensure_response($this->format_post($posts[0]));
    }
    
    public function get_pages(WP_REST_Request $request) {
        $pages = get_posts([
            'post_type' => 'page',
            'post_status' => 'publish',
            'posts_per_page' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        $formatted_pages = array_map([$this, 'format_page'], $pages);
        return rest_ensure_response($formatted_pages);
    }
    
    public function get_page(WP_REST_Request $request) {
        $slug = $request->get_param('slug');
        
        $pages = get_posts([
            'name' => $slug,
            'post_type' => 'page',
            'post_status' => 'publish',
            'posts_per_page' => 1,
        ]);
        
        if (empty($pages)) {
            return new WP_Error('not_found', 'Page not found', ['status' => 404]);
        }
        
        return rest_ensure_response($this->format_page($pages[0]));
    }
    
    public function get_categories(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        $categories = get_categories([
            'hide_empty' => false,
            'orderby' => 'count',
            'order' => 'DESC',
        ]);
        
        $formatted = array_map(function($cat) use ($locale) {
            return [
                'id' => $cat->term_id,
                'name' => html_entity_decode($cat->name),
                'slug' => $cat->slug,
                'description' => $cat->description,
                'count' => $cat->count,
            ];
        }, $categories);
        
        return rest_ensure_response($formatted);
    }
    
    public function get_category_posts(WP_REST_Request $request) {
        $slug = $request->get_param('slug');
        $page = intval($request->get_param('page')) ?: 1;
        $per_page = intval($request->get_param('per_page')) ?: 30;
        
        $category = get_category_by_slug($slug);
        
        if (!$category) {
            return new WP_Error('not_found', 'Category not found', ['status' => 404]);
        }
        
        $posts = get_posts([
            'category' => $category->term_id,
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        return rest_ensure_response([
            'category' => [
                'id' => $category->term_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
            ],
            'posts' => array_map([$this, 'format_post'], $posts),
        ]);
    }
    
    public function get_menus(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        $location = $request->get_param('location');
        
        $theme_locations = get_nav_menu_locations();
        
        if ($location) {
            $menu_location = $location;
        } else {
            $menu_location = $locale === 'en' ? 'header_en' : 'header_bn';
        }
        
        $menu_id = isset($theme_locations[$menu_location]) ? $theme_locations[$menu_location] : 0;
        
        if (!$menu_id) {
            $menus = wp_get_nav_menus();
            if (!empty($menus)) {
                $menu_id = $menus[0]->term_id;
            }
        }
        
        if (!$menu_id) return [];
        
        $menu_items = wp_get_nav_menu_items($menu_id);
        $site_url = get_site_url();
        
        $result = [];
        foreach ($menu_items as $item) {
            $path = str_replace($site_url, '', $item->url);
            $path = rtrim($path, '/');
            $nextjs_url = '/' . $locale . $path;
            
            $result[] = [
                'label' => $item->title,
                'url' => $nextjs_url,
                'ID' => $item->ID
            ];
        }
        
        return rest_ensure_response($result);
    }
    
    public function get_footer_menu(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        
        $theme_locations = get_nav_menu_locations();
        $menu_location = $locale === 'en' ? 'footer_en' : 'footer_bn';
        
        $menu_id = isset($theme_locations[$menu_location]) ? $theme_locations[$menu_location] : 0;
        
        if (!$menu_id) {
            $menus = wp_get_nav_menus();
            if (!empty($menus)) {
                $menu_id = $menus[0]->term_id;
            }
        }
        
        if (!$menu_id) return [];
        
        $menu_items = wp_get_nav_menu_items($menu_id);
        $site_url = get_site_url();
        
        $result = [];
        foreach ($menu_items as $item) {
            $path = str_replace($site_url, '', $item->url);
            $path = rtrim($path, '/');
            $nextjs_url = '/' . $locale . $path;
            
            $result[] = [
                'label' => $item->title,
                'url' => $nextjs_url,
                'ID' => $item->ID
            ];
        }
        
        return rest_ensure_response($result);
    }
    
    public function get_site_options(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        
        $logo = get_option('hwpc_site_logo', '');
        $site_icon = get_option('hwpc_site_icon', '');
        $urgent_notice = get_option('hwpc_urgent_notice', '');
        $youtube_url = get_option('hwpc_youtube_url', 'https://www.youtube.com/@TheEyePress');
        $youtube_videos_raw = get_option('hwpc_youtube_videos', '');
        $ads_raw = get_option('hwpc_ads', '');
        $date_time_html_bn = get_option('hwpc_date_time_html_bn', '');
        $date_time_html_en = get_option('hwpc_date_time_html_en', '');
        $ticker_html_bn = get_option('hwpc_ticker_html_bn', '');
        $ticker_html_en = get_option('hwpc_ticker_html_en', '');
        
        $videos = [];
        if (!empty($youtube_videos_raw)) {
            $lines = explode("\n", trim($youtube_videos_raw));
            foreach ($lines as $line) {
                $line = trim($line);
                if (!empty($line)) {
                    preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $line, $matches);
                    $video_id = isset($matches[1]) ? $matches[1] : '';
                    if ($video_id) {
                        $videos[] = [
                            'type' => 'youtube',
                            'videoId' => $video_id,
                            'url' => $line,
                            'thumbnail' => 'https://img.youtube.com/vi/' . $video_id . '/maxresdefault.jpg'
                        ];
                    }
                }
            }
        }
        
        $ads = [];
        if (!empty($ads_raw)) {
            $lines = explode("\n", trim($ads_raw));
            foreach ($lines as $line) {
                $parts = explode('|', trim($line));
                if (count($parts) >= 3) {
                    $slot = intval($parts[0]);
                    $ads['ad_slot_' . $slot] = [
                        'image' => trim($parts[1]),
                        'link' => trim($parts[2])
                    ];
                }
            }
        }
        
        return rest_ensure_response([
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => get_site_url(),
            'language' => get_bloginfo('language'),
            'charset' => get_bloginfo('charset'),
            'logo' => $logo,
            'siteIcon' => $site_icon,
            'urgentNotice' => $urgent_notice,
            'youtubeUrl' => $youtube_url,
            'videos' => $videos,
            'ads' => $ads,
            'dateTimeHTML' => $locale === 'en' ? $date_time_html_en : $date_time_html_bn,
            'tickerHTML' => $locale === 'en' ? $ticker_html_en : $ticker_html_bn,
        ]);
    }
    
    public function search_posts(WP_REST_Request $request) {
        $query = $request->get_param('q');
        $page = intval($request->get_param('page')) ?: 1;
        
        $posts = get_posts([
            's' => $query,
            'post_status' => 'publish',
            'posts_per_page' => 20,
            'paged' => $page,
        ]);
        
        return rest_ensure_response([
            'results' => array_map([$this, 'format_post'], $posts),
            'found' => count($posts),
        ]);
    }
    
    public function get_stats(WP_REST_Request $request) {
        $total_posts = wp_count_posts()->publish;
        $total_pages = wp_count_posts('page')->publish;
        $total_categories = wp_count_terms('category');
        
        return rest_ensure_response([
            'total_posts' => $total_posts,
            'total_pages' => $total_pages,
            'total_categories' => $total_categories,
        ]);
    }
    
    public function get_ticker(WP_REST_Request $request) {
        $count = intval($request->get_param('count')) ?: 10;
        
        $posts = get_posts([
            'post_status' => 'publish',
            'posts_per_page' => $count,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        return rest_ensure_response(array_map(function($post) {
            return [
                'title' => html_entity_decode($post->post_title),
                'slug' => $post->post_name,
                'date' => $post->post_date,
            ];
        }, $posts));
    }
    
    public function get_trending(WP_REST_Request $request) {
        $count = intval($request->get_param('count')) ?: 10;
        
        $posts = get_posts([
            'post_status' => 'publish',
            'posts_per_page' => $count,
            'orderby' => 'meta_value_num',
            'meta_key' => 'views',
            'order' => 'DESC',
        ]);
        
        return rest_ensure_response(array_map([$this, 'format_post'], $posts));
    }
    
    public function get_authors(WP_REST_Request $request) {
        $users = get_users(['role' => 'author']);
        
        $formatted = array_map(function($user) {
            return [
                'id' => $user->ID,
                'name' => $user->display_name,
                'slug' => $user->user_nicename,
                'avatar' => get_avatar_url($user->ID, ['size' => 96]),
                'bio' => get_user_meta($user->ID, 'description', true),
            ];
        }, $users);
        
        return rest_ensure_response($formatted);
    }
    
    public function get_author_posts(WP_REST_Request $request) {
        $username = $request->get_param('username');
        $page = intval($request->get_param('page')) ?: 1;
        $per_page = intval($request->get_param('per_page')) ?: 20;
        
        $user = get_user_by('slug', $username);
        
        if (!$user) {
            return new WP_Error('not_found', 'Author not found', ['status' => 404]);
        }
        
        $posts = get_posts([
            'author' => $user->ID,
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        return rest_ensure_response([
            'author' => [
                'id' => $user->ID,
                'name' => $user->display_name,
                'slug' => $user->user_nicename,
                'avatar' => get_avatar_url($user->ID, ['size' => 96]),
                'bio' => get_user_meta($user->ID, 'description', true),
            ],
            'posts' => array_map([$this, 'format_post'], $posts),
        ]);
    }
    
    public function get_translation(WP_REST_Request $request) {
        $group_id = $request->get_param('group_id');
        
        global $wpdb;
        
        $posts = $wpdb->get_results($wpdb->prepare(
            "SELECT p.ID, p.post_name, p.post_title FROM {$wpdb->posts} p
            INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
            WHERE pm.meta_key = 'translation_group_id' AND pm.meta_value = %s
            AND p.post_status = 'publish' AND p.post_type = 'post'",
            $group_id
        ));
        
        $result = ['bn' => null, 'en' => null];
        
        foreach ($posts as $post) {
            $lang = get_post_meta($post->ID, 'language', true);
            if ($lang === 'bn' || $lang === 'en') {
                $result[$lang] = [
                    'id' => $post->ID,
                    'slug' => $post->post_name,
                    'title' => $post->post_title
                ];
            }
        }
        
        return rest_ensure_response($result);
    }
    
    public function get_post_translation(WP_REST_Request $request) {
        $slug = $request->get_param('slug');
        $target_locale = $request->get_param('locale') ?: 'en';
        
        global $wpdb;
        
        $post = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->posts} WHERE post_name = %s AND post_status = 'publish' AND post_type = 'post'",
            $slug
        ));
        
        if (!$post) {
            return ['found' => false, 'message' => 'Post not found'];
        }
        
        $group_id = get_post_meta($post->ID, 'translation_group_id', true);
        
        if (empty($group_id)) {
            return ['found' => false, 'message' => 'No translation found'];
        }
        
        $translation = $wpdb->get_row($wpdb->prepare(
            "SELECT p.* FROM {$wpdb->posts} p
            INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
            WHERE pm.meta_key = 'translation_group_id' AND pm.meta_value = %s
            AND p.post_status = 'publish' AND p.post_type = 'post'
            AND p.ID != %d",
            $group_id, $post->ID
        ));
        
        if ($translation) {
            return [
                'found' => true,
                'locale' => get_post_meta($translation->ID, 'language', true) ?: $target_locale,
                'slug' => $translation->post_name,
                'id' => $translation->ID,
                'group_id' => $group_id
            ];
        }
        
        return ['found' => false, 'message' => 'Translation coming soon'];
    }
    
    public function get_videos(WP_REST_Request $request) {
        $count = intval($request->get_param('count')) ?: 10;
        
        $posts = get_posts([
            'post_status' => 'publish',
            'posts_per_page' => $count,
            'tax_query' => [[
                'taxonomy' => 'category',
                'field' => 'slug',
                'terms' => ['video', 'videos'],
                'operator' => 'IN'
            ]],
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        
        return rest_ensure_response(array_map([$this, 'format_post'], $posts));
    }
    
    public function get_ads(WP_REST_Request $request) {
        $ad_positions = ['header', 'sidebar', 'footer', 'between_posts'];
        
        $ads = [];
        foreach ($ad_positions as $position) {
            $ad_code = get_option('hwpc_ad_' . $position, '');
            if ($ad_code) {
                $ads[$position] = $ad_code;
            }
        }
        
        return rest_ensure_response($ads);
    }
    
    public function submit_contact(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $name = isset($params['name']) ? sanitize_text_field($params['name']) : '';
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        $subject = isset($params['subject']) ? sanitize_text_field($params['subject']) : '';
        $message = isset($params['message']) ? sanitize_textarea_field($params['message']) : '';
        $locale = isset($params['locale']) ? sanitize_text_field($params['locale']) : 'bn';
        
        if (empty($name) || empty($email) || empty($message)) {
            return ['success' => false, 'message' => 'Name, email and message are required'];
        }
        
        if (!is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        $result = $wpdb->insert($this->contacts_table, [
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'locale' => $locale,
            'status' => 'unread'
        ]);
        
        if ($result) {
            return ['success' => true, 'message' => 'Message sent successfully!'];
        }
        
        return ['success' => false, 'message' => 'Failed to send message'];
    }
    
    public function submit_guest_comment(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        
        $post_id = isset($params['post_id']) ? intval($params['post_id']) : 0;
        $name = isset($params['name']) ? sanitize_text_field($params['name']) : '';
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        $website = isset($params['website']) ? esc_url_raw($params['website']) : '';
        $comment_content = isset($params['comment']) ? sanitize_textarea_field($params['comment']) : '';
        
        if (empty($post_id)) {
            return ['success' => false, 'message' => 'Post ID is required'];
        }
        
        if (empty($name) || empty($email) || empty($comment_content)) {
            return ['success' => false, 'message' => 'Name, email and comment are required'];
        }
        
        if (!is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        $post = get_post($post_id);
        if (!$post) {
            return ['success' => false, 'message' => 'Post not found'];
        }
        
        $comment_data = [
            'comment_post_ID' => $post_id,
            'comment_author' => $name,
            'comment_author_email' => $email,
            'comment_author_url' => $website,
            'comment_content' => $comment_content,
            'comment_type' => 'comment',
            'comment_parent' => 0,
            'user_id' => 0,
            'comment_author_IP' => $_SERVER['REMOTE_ADDR'] ?? '',
            'comment_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'comment_date' => current_time('mysql'),
            'comment_date_gmt' => current_time('mysql', 1),
            'comment_approved' => 0
        ];
        
        $result = wp_insert_comment($comment_data);
        
        if ($result && $this->notification_table_exists()) {
            $wpdb->insert($this->notifications_table, [
                'email' => $email,
                'comment_id' => $result,
                'post_id' => $post_id,
                'post_slug' => $post->post_name,
                'post_title' => $post->post_title,
                'status' => '0',
                'notification_read' => 0
            ]);
        }
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Comment submitted successfully! It will appear after approval.',
                'comment_id' => $result
            ];
        }
        
        return ['success' => false, 'message' => 'Failed to submit comment'];
    }
    
    public function get_notifications(WP_REST_Request $request) {
        global $wpdb;
        
        $email = $request->get_param('email');
        
        if (empty($email) || !is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        if (!$this->notification_table_exists()) {
            return ['success' => true, 'notifications' => [], 'unread_count' => 0];
        }
        
        $notifications = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$this->notifications_table} WHERE email = %s ORDER BY created_at DESC LIMIT 50",
            $email
        ));
        
        $unread_count = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->notifications_table} WHERE email = %s AND notification_read = 0",
            $email
        ));
        
        return [
            'success' => true,
            'notifications' => $notifications,
            'unread_count' => intval($unread_count)
        ];
    }
    
    public function mark_notifications_read(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        
        if (empty($email) || !is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        if ($this->notification_table_exists()) {
            $wpdb->query($wpdb->prepare(
                "UPDATE {$this->notifications_table} SET notification_read = 1 WHERE email = %s",
                $email
            ));
        }
        
        return ['success' => true];
    }
    
    public function sync_notifications(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        
        if (empty($email) || !is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        if (!$this->notification_table_exists()) {
            return ['success' => false, 'message' => 'Notifications table not found'];
        }
        
        $comments = $wpdb->get_results($wpdb->prepare(
            "SELECT c.comment_ID, c.comment_post_ID, c.comment_approved, p.post_title, p.post_name 
            FROM $wpdb->comments c 
            LEFT JOIN $wpdb->posts p ON c.comment_post_ID = p.ID 
            WHERE c.comment_author_email = %s 
            ORDER BY c.comment_date DESC
            LIMIT 50",
            $email
        ));
        
        $synced = 0;
        
        foreach ($comments as $comment) {
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM {$this->notifications_table} WHERE comment_id = %d",
                $comment->comment_ID
            ));
            
            $status = $comment->comment_approved;
            if ($status === '1' || $status === 1) {
                $status = 'approved';
            } elseif ($status === 'spam') {
                $status = 'spam';
            } elseif ($status === 'trash') {
                $status = 'trash';
            } else {
                $status = 'pending';
            }
            
            if (!$exists) {
                $wpdb->insert($this->notifications_table, [
                    'email' => $email,
                    'comment_id' => $comment->comment_ID,
                    'post_id' => $comment->comment_post_ID,
                    'post_slug' => $comment->post_name ?: '',
                    'post_title' => $comment->post_title ?: 'Unknown Post',
                    'status' => $status,
                    'notification_read' => 0
                ]);
                $synced++;
            }
        }
        
        return [
            'success' => true,
            'message' => "Synced $synced comments",
            'synced' => $synced,
            'total_found' => count($comments)
        ];
    }
    
    public function user_login(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $username = isset($params['username']) ? $params['username'] : '';
        $password = isset($params['password']) ? $params['password'] : '';
        
        if (empty($username) || empty($password)) {
            return ['success' => false, 'message' => 'Username and password are required'];
        }
        
        $user = get_user_by('login', $username);
        if (!$user) {
            $user = get_user_by('email', $username);
        }
        
        if (!$user) {
            return ['success' => false, 'message' => 'Invalid username or password'];
        }
        
        if (!wp_check_password($password, $user->user_pass, $user->ID)) {
            return ['success' => false, 'message' => 'Invalid username or password'];
        }
        
        $avatar_url = get_avatar_url($user->ID, ['size' => 96]);
        
        return [
            'success' => true,
            'user' => [
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'name' => $user->display_name,
                'avatar' => $avatar_url,
                'role' => $user->roles[0] ?? 'subscriber'
            ],
            'message' => 'Login successful'
        ];
    }
    
    public function user_register(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $username = isset($params['username']) ? sanitize_text_field($params['username']) : '';
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        $password = isset($params['password']) ? $params['password'] : '';
        $name = isset($params['name']) ? sanitize_text_field($params['name']) : '';
        
        if (empty($username) || empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }
        
        if (!is_email($email)) {
            return ['success' => false, 'message' => 'Invalid email address'];
        }
        
        if (username_exists($username)) {
            return ['success' => false, 'message' => 'Username already exists'];
        }
        
        if (email_exists($email)) {
            return ['success' => false, 'message' => 'Email already exists'];
        }
        
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'Password must be at least 6 characters'];
        }
        
        $user_id = wp_create_user($username, $password, $email);
        
        if (is_wp_error($user_id)) {
            return ['success' => false, 'message' => $user_id->get_error_message()];
        }
        
        wp_update_user([
            'ID' => $user_id,
            'display_name' => $name ?: $username
        ]);
        
        return [
            'success' => true,
            'message' => 'Registration successful! You can now login.'
        ];
    }
    
    public function subscribe(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        $locale = isset($params['locale']) ? sanitize_text_field($params['locale']) : 'bn';
        
        if (empty($email) || !is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->subscriptions_table} WHERE email = %s",
            $email
        ));
        
        if ($existing) {
            if ($existing->status === 'active') {
                return ['success' => false, 'message' => 'Email already subscribed'];
            }
            $wpdb->update($this->subscriptions_table, 
                ['status' => 'active', 'subscribed_at' => current_time('mysql'), 'unsubscribed_at' => null],
                ['email' => $email]
            );
            return ['success' => true, 'message' => 'Successfully resubscribed!'];
        }
        
        $wpdb->insert($this->subscriptions_table, [
            'email' => $email,
            'locale' => $locale,
            'status' => 'active',
            'subscribed_at' => current_time('mysql')
        ]);
        
        return ['success' => true, 'message' => 'Successfully subscribed!'];
    }
    
    public function check_subscription(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        
        if (empty($email) || !is_email($email)) {
            return ['subscribed' => false];
        }
        
        $sub = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->subscriptions_table} WHERE email = %s",
            $email
        ));
        
        return [
            'subscribed' => $sub && $sub->status === 'active' ? true : false,
            'email' => $email
        ];
    }
    
    public function unsubscribe(WP_REST_Request $request) {
        global $wpdb;
        
        $params = $request->get_json_params();
        $email = isset($params['email']) ? sanitize_email($params['email']) : '';
        
        if (empty($email) || !is_email($email)) {
            return ['success' => false, 'message' => 'Valid email is required'];
        }
        
        $wpdb->update($this->subscriptions_table, 
            ['status' => 'unsubscribed', 'unsubscribed_at' => current_time('mysql')],
            ['email' => $email]
        );
        
        return ['success' => true, 'message' => 'Successfully unsubscribed'];
    }
    
    public function resubscribe(WP_REST_Request $request) {
        return $this->subscribe($request);
    }
    
    public function search_all(WP_REST_Request $request) {
        $query = $request->get_param('q');
        $locale = $request->get_param('locale') ?: 'bn';
        
        if (empty($query)) {
            return ['results' => [], 'found' => 0];
        }
        
        $posts = get_posts([
            's' => $query,
            'post_status' => 'publish',
            'posts_per_page' => 50,
            'orderby' => 'relevance',
        ]);
        
        $results = array_map([$this, 'format_post'], $posts);
        
        return ['results' => $results, 'found' => count($results)];
    }
    
    public function get_category_slugs(WP_REST_Request $request) {
        $locale = $request->get_param('locale') ?: 'bn';
        
        $categories = get_categories([
            'hide_empty' => false,
            'orderby' => 'count',
            'order' => 'DESC',
        ]);
        
        $slugs = [];
        foreach ($categories as $cat) {
            $slugs[] = [
                'bn_slug' => $cat->slug,
                'en_slug' => $cat->slug,
                'bn_name' => $cat->name,
                'en_name' => $cat->name,
                'translation_group_id' => '',
            ];
        }
        
        return $slugs;
    }
    
    public function track_view(WP_REST_Request $request) {
        $slug = $request->get_param('slug');
        
        if (empty($slug)) {
            return ['success' => false];
        }
        
        $posts = get_posts([
            'name' => $slug,
            'post_status' => 'publish',
            'posts_per_page' => 1,
        ]);
        
        if (empty($posts)) {
            return ['success' => false];
        }
        
        $post_id = $posts[0]->ID;
        $views = get_post_meta($post_id, 'views', true) ?: 0;
        update_post_meta($post_id, 'views', intval($views) + 1);
        
        return ['success' => true, 'views' => intval($views) + 1];
    }
    
    public function export_all_data(WP_REST_Request $request) {
        $posts = get_posts(['numberposts' => -1, 'post_status' => 'publish']);
        $pages = get_pages(['post_status' => 'publish']);
        $categories = get_categories(['hide_empty' => false]);
        $media = get_posts(['post_type' => 'attachment', 'numberposts' => -1]);
        
        $export_data = [
            'posts' => array_map([$this, 'format_post'], $posts),
            'pages' => array_map([$this, 'format_page'], $pages),
            'categories' => array_map([$this, 'format_category'], $categories),
            'media' => array_map([$this, 'format_media'], $media),
            'site_info' => [
                'name' => get_bloginfo('name'),
                'description' => get_bloginfo('description'),
                'url' => get_site_url(),
                'language' => get_bloginfo('language'),
                'charset' => get_bloginfo('charset'),
                'exported_at' => current_time('mysql'),
            ],
            'api_config' => [
                'base_url' => get_site_url() . '/wp-json/eyepress/v1',
                'endpoints' => [
                    'posts' => '/posts?locale=bn&per_page=20',
                    'single_post' => '/post/{slug}',
                    'categories' => '/categories',
                    'category_posts' => '/category/{slug}',
                    'menus' => '/menus',
                    'footer_menu' => '/menus/footer',
                    'site_options' => '/site-options',
                    'search' => '/search?q={query}',
                    'stats' => '/stats',
                    'ticker' => '/ticker?count=10',
                    'trending' => '/trending?count=10',
                    'authors' => '/authors',
                    'author_posts' => '/author/{username}',
                    'videos' => '/videos?count=10',
                    'ads' => '/ads',
                    'contact' => '/contact',
                    'guest_comment' => '/guest-comment',
                    'notifications' => '/notifications?email={email}',
                    'login' => '/login',
                    'register' => '/register',
                    'subscribe' => '/subscribe',
                    'subscription-status' => '/subscription-status',
                    'unsubscribe' => '/unsubscribe',
                    'resubscribe' => '/resubscribe',
                    'search-all' => '/search-all?q={query}',
                    'category-slugs' => '/category-slugs',
                    'track-view' => '/track-view?slug={slug}',
                ],
            ],
        ];
        
        return rest_ensure_response($export_data);
    }
    
    private function format_post($post) {
        $categories = get_the_category($post->ID);
        $category_names = array_map(function($cat) {
            return $cat->name;
        }, $categories);
        
        return [
            'id' => $post->ID,
            'title' => html_entity_decode($post->post_title),
            'slug' => $post->post_name,
            'content' => $post->post_content,
            'excerpt' => $post->post_excerpt,
            'date' => $post->post_date,
            'modified' => $post->post_modified,
            'status' => $post->post_status,
            'featuredImage' => [
                'node' => [
                    'sourceUrl' => get_the_post_thumbnail_url($post->ID, 'full') ?: '',
                    'altText' => get_post_meta($post->ID, '_wp_attachment_image_alt', true) ?: '',
                ],
            ],
            'categories' => [
                'nodes' => array_map(function($cat) {
                    return ['name' => $cat->name, 'slug' => $cat->slug];
                }, $categories),
            ],
            'author' => [
                'node' => [
                    'name' => get_the_author_meta('display_name', $post->post_author),
                    'slug' => get_the_author_meta('user_nicename', $post->post_author),
                ],
            ],
            'seo' => [
                'title' => get_post_meta($post->ID, '_yoast_wpseo_title', true) ?: '',
                'description' => get_post_meta($post->ID, '_yoast_wpseo_metadesc', true) ?: '',
            ],
            'language' => get_post_meta($post->ID, 'language', true) ?: 'bn',
            'translation_group_id' => get_post_meta($post->ID, 'translation_group_id', true) ?: '',
        ];
    }
    
    private function format_page($page) {
        return [
            'id' => $page->ID,
            'title' => html_entity_decode($page->post_title),
            'slug' => $page->post_name,
            'content' => $page->post_content,
            'template' => get_page_template_slug($page->ID),
            'seo' => [
                'title' => get_post_meta($page->ID, '_yoast_wpseo_title', true) ?: '',
                'description' => get_post_meta($page->ID, '_yoast_wpseo_metadesc', true) ?: '',
            ],
        ];
    }
    
    private function format_category($category) {
        return [
            'id' => $category->term_id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'count' => $category->count,
        ];
    }
    
    private function format_media($attachment) {
        return [
            'id' => $attachment->ID,
            'title' => $attachment->post_title,
            'url' => wp_get_attachment_url($attachment->ID),
            'mime_type' => $attachment->post_mime_type,
            'alt' => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
        ];
    }
    
    public function contacts_page() {
        global $wpdb;
        $table_name = $this->contacts_table;
        
        $per_page = 20;
        $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($page - 1) * $per_page;
        
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $where = $search ? $wpdb->prepare("WHERE name LIKE %s OR email LIKE %s OR message LIKE %s", '%' . $search . '%', '%' . $search . '%', '%' . $search . '%') : '';
        
        $filter_status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        if ($filter_status) {
            $where .= $where ? $wpdb->prepare(" AND status = %s", $filter_status) : $wpdb->prepare("WHERE status = %s", $filter_status);
        }
        
        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name $where");
        $contacts = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name $where ORDER BY created_at DESC LIMIT %d OFFSET %d", $per_page, $offset));
        
        $unread = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE status = 'unread'");
        $total_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        
        $total_pages = ceil($total / $per_page);
        ?>
        
        <style>
            .hwpc-wrap { padding: 20px; max-width: 1600px; margin: 0 auto; }
            .hwpc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
            .hwpc-header h1 { margin: 0; font-size: 28px; color: #1d2327; }
            .hwpc-header h1 span { color: #A41E22; }
            
            .hwpc-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .hwpc-stat-card { background: linear-gradient(135deg, #A41E22 0%, #8a1a1d 100%); color: white; padding: 24px; border-radius: 12px; position: relative; overflow: hidden; }
            .hwpc-stat-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: rgba(255,255,255,0.1); border-radius: 50%; }
            .hwpc-stat-card.unread { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); }
            .hwpc-stat-card h3 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
            .hwpc-stat-card .count { font-size: 36px; font-weight: 700; margin: 0; }
            
            .hwpc-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s; }
            .hwpc-btn-primary { background: #A41E22; color: white; }
            .hwpc-btn-primary:hover { background: #8a1a1d; }
            .hwpc-btn-secondary { background: #6c757d; color: white; }
            .hwpc-btn-secondary:hover { background: #5a6268; }
            .hwpc-btn-danger { background: #dc3545; color: white; }
            .hwpc-btn-danger:hover { background: #c82333; }
            .hwpc-btn-success { background: #28a745; color: white; }
            
            .hwpc-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
            .hwpc-search { display: flex; gap: 10px; }
            .hwpc-search input { padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; min-width: 250px; }
            .hwpc-search select { padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; }
            
            .hwpc-table-wrap { background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
            .hwpc-table { width: 100%; border-collapse: collapse; }
            .hwpc-table th { background: #f8f9fa; padding: 14px 16px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; font-size: 13px; text-transform: uppercase; }
            .hwpc-table td { padding: 14px 16px; border-bottom: 1px solid #eee; vertical-align: top; }
            .hwpc-table tr:hover { background: #f8f9fa; }
            
            .hwpc-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .hwpc-badge-unread { background: #fff3cd; color: #856404; }
            .hwpc-badge-read { background: #d4edda; color: #155724; }
            
            .hwpc-message { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            
            .hwpc-actions { display: flex; gap: 8px; }
            
            .hwpc-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 30px; }
            .hwpc-pagination a { display: inline-block; padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; color: #333; }
            .hwpc-pagination a:hover { background: #A41E22; color: white; border-color: #A41E22; }
            .hwpc-pagination .current { background: #A41E22; color: white; border-color: #A41E22; }
            
            .hwpc-empty { text-align: center; padding: 60px 20px; color: #6c757d; }
            
            .hwpc-view-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
            .hwpc-view-modal.active { display: flex; }
            .hwpc-modal-content { background: white; padding: 30px; border-radius: 12px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; }
            .hwpc-modal h2 { margin-top: 0; color: #A41E22; }
            .hwpc-modal-field { margin-bottom: 15px; }
            .hwpc-modal-field label { display: block; font-weight: 600; color: #666; margin-bottom: 5px; }
            .hwpc-modal-field p { margin: 0; color: #333; }
        </style>
        
        <div class="hwpc-wrap">
            <div class="hwpc-header">
                <h1>Contact <span>Messages</span></h1>
            </div>
            
            <div class="hwpc-stats">
                <div class="hwpc-stat-card">
                    <h3>Total Messages</h3>
                    <p class="count"><?php echo number_format($total_count); ?></p>
                </div>
                <div class="hwpc-stat-card unread">
                    <h3>Unread Messages</h3>
                    <p class="count"><?php echo number_format($unread); ?></p>
                </div>
            </div>
            
            <div class="hwpc-toolbar">
                <form method="get" class="hwpc-search">
                    <input type="hidden" name="page" value="hwpc-contacts">
                    <input type="text" name="s" placeholder="Search by name, email or message..." value="<?php echo esc_attr($search); ?>">
                    <select name="status">
                        <option value="">All Status</option>
                        <option value="unread" <?php selected($filter_status, 'unread'); ?>>Unread</option>
                        <option value="read" <?php selected($filter_status, 'read'); ?>>Read</option>
                    </select>
                    <button type="submit" class="hwpc-btn hwpc-btn-primary">Search</button>
                    <?php if ($search || $filter_status): ?>
                        <a href="?page=hwpc-contacts" class="hwpc-btn hwpc-btn-secondary">Clear</a>
                    <?php endif; ?>
                </form>
            </div>
            
            <div class="hwpc-table-wrap">
                <?php if ($contacts): ?>
                    <table class="hwpc-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($contacts as $i => $c): ?>
                                <tr style="<?php echo $c->status == 'unread' ? 'background: #fffef5;' : ''; ?>">
                                    <td><?php echo $offset + $i + 1; ?></td>
                                    <td><strong><?php echo esc_html($c->name); ?></strong></td>
                                    <td><a href="mailto:<?php echo esc_html($c->email); ?>"><?php echo esc_html($c->email); ?></a></td>
                                    <td><?php echo esc_html($c->subject ?: '-'); ?></td>
                                    <td>
                                        <span class="hwpc-message" title="<?php echo esc_attr($c->message); ?>">
                                            <?php echo esc_html($c->message); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="hwpc-badge hwpc-badge-<?php echo $c->status; ?>">
                                            <?php echo ucfirst($c->status); ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M j, Y g:i A', strtotime($c->created_at)); ?></td>
                                    <td>
                                        <div class="hwpc-actions">
                                            <button class="hwpc-btn hwpc-btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="viewMessage(<?php echo $c->id; ?>, '<?php echo esc_js($c->name); ?>', '<?php echo esc_js($c->email); ?>', '<?php echo esc_js($c->subject ?: ''); ?>', '<?php echo esc_js($c->message); ?>', '<?php echo $c->status; ?>', '<?php echo date('M j, Y g:i A', strtotime($c->created_at)); ?>')">View</button>
                                            <?php if ($c->status == 'unread'): ?>
                                                <a href="?page=hwpc-contacts&action=mark-read&id=<?php echo $c->id; ?>" class="hwpc-btn hwpc-btn-success" style="padding: 6px 12px; font-size: 12px;">Mark Read</a>
                                            <?php endif; ?>
                                            <a href="?page=hwpc-contacts&action=delete&id=<?php echo $c->id; ?>" class="hwpc-btn hwpc-btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="return confirm('Are you sure you want to delete this message?');">Delete</a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div class="hwpc-empty">
                        <h3>No messages found</h3>
                        <p>Contact form submissions will appear here.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if ($total_pages > 1): ?>
                <div class="hwpc-pagination">
                    <?php
                    $base_url = '?page=hwpc-contacts';
                    if ($search) $base_url .= '&s=' . urlencode($search);
                    if ($filter_status) $base_url .= '&status=' . $filter_status;
                    
                    if ($page > 1): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $page - 1; ?>">&laquo; Previous</a>
                    <?php endif;
                    
                    for ($i = 1; $i <= min($total_pages, 5); $i++): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $i; ?>" class="<?php echo $i == $page ? 'current' : ''; ?>"><?php echo $i; ?></a>
                    <?php endfor;
                    
                    if ($page < $total_pages): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $page + 1; ?>">Next &raquo;</a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div id="viewModal" class="hwpc-view-modal" onclick="if(event.target === this) this.classList.remove('active')">
                <div class="hwpc-modal-content">
                    <h2>Message Details</h2>
                    <div class="hwpc-modal-field">
                        <label>Name</label>
                        <p id="viewName"></p>
                    </div>
                    <div class="hwpc-modal-field">
                        <label>Email</label>
                        <p><a id="viewEmail" href=""></a></p>
                    </div>
                    <div class="hwpc-modal-field">
                        <label>Subject</label>
                        <p id="viewSubject"></p>
                    </div>
                    <div class="hwpc-modal-field">
                        <label>Message</label>
                        <p id="viewMessageText" style="white-space: pre-wrap;"></p>
                    </div>
                    <div class="hwpc-modal-field">
                        <label>Status</label>
                        <p><span id="viewStatus" class="hwpc-badge"></span></p>
                    </div>
                    <div class="hwpc-modal-field">
                        <label>Date</label>
                        <p id="viewDate"></p>
                    </div>
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="hwpc-btn hwpc-btn-secondary" onclick="document.getElementById('viewModal').classList.remove('active')">Close</button>
                    </div>
                </div>
            </div>
            
            <script>
            function viewMessage(id, name, email, subject, message, status, date) {
                document.getElementById('viewName').textContent = name;
                document.getElementById('viewEmail').textContent = email;
                document.getElementById('viewEmail').href = 'mailto:' + email;
                document.getElementById('viewSubject').textContent = subject || '-';
                document.getElementById('viewMessageText').textContent = message;
                document.getElementById('viewStatus').textContent = status;
                document.getElementById('viewStatus').className = 'hwpc-badge hwpc-badge-' + status;
                document.getElementById('viewDate').textContent = date;
                document.getElementById('viewModal').classList.add('active');
            }
            </script>
        </div>
        <?php
    }
    
    public function newsletter_page() {
        global $wpdb;
        $table_name = $this->subscriptions_table;
        
        $per_page = 20;
        $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $offset = ($page - 1) * $per_page;
        
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $where = $search ? $wpdb->prepare("WHERE email LIKE %s", '%' . $search . '%') : '';
        
        $filter_locale = isset($_GET['locale']) ? sanitize_text_field($_GET['locale']) : '';
        if ($filter_locale) {
            $where .= $where ? $wpdb->prepare(" AND locale = %s", $filter_locale) : $wpdb->prepare("WHERE locale = %s", $filter_locale);
        }
        
        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name $where");
        $subscribers = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name $where ORDER BY subscribed_at DESC LIMIT %d OFFSET %d", $per_page, $offset));
        
        $total_pages = ceil($total / $per_page);
        
        $stats = [
            'total' => $wpdb->get_var("SELECT COUNT(*) FROM $table_name"),
            'active' => $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE status = 'active'"),
            'bn' => $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE locale = 'bn'"),
            'en' => $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE locale = 'en'")
        ];
        ?>
        
        <style>
            .hwpc-wrap { padding: 20px; max-width: 1400px; margin: 0 auto; }
            .hwpc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
            .hwpc-header h1 { margin: 0; font-size: 28px; color: #1d2327; }
            .hwpc-header h1 span { color: #A41E22; }
            
            .hwpc-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .hwpc-stat-card { background: linear-gradient(135deg, #A41E22 0%, #8a1a1d 100%); color: white; padding: 24px; border-radius: 12px; position: relative; overflow: hidden; }
            .hwpc-stat-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: rgba(255,255,255,0.1); border-radius: 50%; }
            .hwpc-stat-card.green { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); }
            .hwpc-stat-card.blue { background: linear-gradient(135deg, #0073aa 0%, #005177 100%); }
            .hwpc-stat-card.gray { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); }
            .hwpc-stat-card h3 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
            .hwpc-stat-card .count { font-size: 36px; font-weight: 700; margin: 0; }
            
            .hwpc-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .hwpc-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s; }
            .hwpc-btn-primary { background: #A41E22; color: white; }
            .hwpc-btn-primary:hover { background: #8a1a1d; }
            .hwpc-btn-success { background: #28a745; color: white; }
            .hwpc-btn-success:hover { background: #218838; }
            .hwpc-btn-secondary { background: #6c757d; color: white; }
            .hwpc-btn-secondary:hover { background: #5a6268; }
            .hwpc-btn-danger { background: #dc3545; color: white; }
            .hwpc-btn-danger:hover { background: #c82333; }
            
            .hwpc-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
            .hwpc-search { display: flex; gap: 10px; }
            .hwpc-search input { padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; min-width: 250px; }
            .hwpc-search select { padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; }
            
            .hwpc-table-wrap { background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
            .hwpc-table { width: 100%; border-collapse: collapse; }
            .hwpc-table th { background: #f8f9fa; padding: 14px 16px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; font-size: 13px; text-transform: uppercase; }
            .hwpc-table td { padding: 14px 16px; border-bottom: 1px solid #eee; }
            .hwpc-table tr:hover { background: #f8f9fa; }
            .hwpc-table tr:last-child td { border-bottom: none; }
            
            .hwpc-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .hwpc-badge-bn { background: #A41E22; color: white; }
            .hwpc-badge-en { background: #0073aa; color: white; }
            .hwpc-badge-active { background: #d4edda; color: #155724; }
            .hwpc-badge-inactive { background: #f8d7da; color: #721c24; }
            
            .hwpc-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 30px; }
            .hwpc-pagination a, .hwpc-pagination span { display: inline-block; padding: 8px 14px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; color: #333; }
            .hwpc-pagination a:hover { background: #A41E22; color: white; border-color: #A41E22; }
            .hwpc-pagination .current { background: #A41E22; color: white; border-color: #A41E22; }
            
            .hwpc-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
            .hwpc-modal.active { display: flex; }
            .hwpc-modal-content { background: white; padding: 30px; border-radius: 12px; max-width: 450px; width: 90%; }
            .hwpc-modal h2 { margin-top: 0; color: #A41E22; }
            .hwpc-modal input, .hwpc-modal select { width: 100%; padding: 12px; margin: 15px 0; border: 1px solid #ddd; border-radius: 6px; }
            .hwpc-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
            
            .hwpc-empty { text-align: center; padding: 60px 20px; color: #6c757d; }
            .hwpc-empty svg { width: 64px; height: 64px; margin-bottom: 15px; opacity: 0.5; }
            
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .hwpc-animate { animation: fadeIn 0.3s ease-out; }
        </style>
        
        <div class="hwpc-wrap hwpc-animate">
            <div class="hwpc-header">
                <h1>Newsletter <span>Subscribers</span></h1>
                <div class="hwpc-actions">
                    <button class="hwpc-btn hwpc-btn-success" onclick="document.getElementById('addModal').classList.add('active')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                        Add Subscriber
                    </button>
                    <a href="?page=hwpc-newsletter&hwpc_export=csv" class="hwpc-btn hwpc-btn-secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Export CSV
                    </a>
                </div>
            </div>
            
            <div class="hwpc-stats">
                <div class="hwpc-stat-card">
                    <h3>Total Subscribers</h3>
                    <p class="count"><?php echo number_format($stats['total']); ?></p>
                </div>
                <div class="hwpc-stat-card green">
                    <h3>Active Subscribers</h3>
                    <p class="count"><?php echo number_format($stats['active']); ?></p>
                </div>
                <div class="hwpc-stat-card blue">
                    <h3>Bengali (BN)</h3>
                    <p class="count"><?php echo number_format($stats['bn']); ?></p>
                </div>
                <div class="hwpc-stat-card gray">
                    <h3>English (EN)</h3>
                    <p class="count"><?php echo number_format($stats['en']); ?></p>
                </div>
            </div>
            
            <div class="hwpc-toolbar">
                <form method="get" class="hwpc-search">
                    <input type="hidden" name="page" value="hwpc-newsletter">
                    <input type="text" name="s" placeholder="Search by email..." value="<?php echo esc_attr($search); ?>">
                    <select name="locale">
                        <option value="">All Languages</option>
                        <option value="bn" <?php selected($filter_locale, 'bn'); ?>>Bengali</option>
                        <option value="en" <?php selected($filter_locale, 'en'); ?>>English</option>
                    </select>
                    <button type="submit" class="hwpc-btn hwpc-btn-primary">Search</button>
                    <?php if ($search || $filter_locale): ?>
                        <a href="?page=hwpc-newsletter" class="hwpc-btn hwpc-btn-secondary">Clear</a>
                    <?php endif; ?>
                </form>
            </div>
            
            <div class="hwpc-table-wrap">
                <?php if ($subscribers): ?>
                    <table class="hwpc-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email Address</th>
                                <th>Language</th>
                                <th>Status</th>
                                <th>Subscribed Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($subscribers as $i => $sub): ?>
                                <tr>
                                    <td><?php echo $offset + $i + 1; ?></td>
                                    <td><strong><?php echo esc_html($sub->email); ?></strong></td>
                                    <td>
                                        <span class="hwpc-badge hwpc-badge-<?php echo $sub->locale; ?>">
                                            <?php echo strtoupper($sub->locale); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="hwpc-badge hwpc-badge-<?php echo $sub->status; ?>">
                                            <?php echo ucfirst($sub->status); ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M j, Y g:i A', strtotime($sub->subscribed_at)); ?></td>
                                    <td>
                                        <form method="post" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this subscriber?');">
                                            <?php wp_nonce_field('hwpc_delete_' . $sub->id); ?>
                                            <input type="hidden" name="subscriber_id" value="<?php echo $sub->id; ?>">
                                            <button type="submit" name="hwpc_delete_subscriber" class="hwpc-btn hwpc-btn-danger" style="padding: 6px 12px; font-size: 12px;">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div class="hwpc-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <h3>No subscribers found</h3>
                        <p>Share your subscribe page to get started!</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if ($total_pages > 1): ?>
                <div class="hwpc-pagination">
                    <?php
                    $base_url = '?page=hwpc-newsletter';
                    if ($search) $base_url .= '&s=' . urlencode($search);
                    if ($filter_locale) $base_url .= '&locale=' . $filter_locale;
                    
                    if ($page > 1): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $page - 1; ?>">&laquo; Previous</a>
                    <?php endif;
                    
                    for ($i = 1; $i <= min($total_pages, 5); $i++): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $i; ?>" class="<?php echo $i == $page ? 'current' : ''; ?>"><?php echo $i; ?></a>
                    <?php endfor;
                    
                    if ($page < $total_pages): ?>
                        <a href="<?php echo $base_url; ?>&paged=<?php echo $page + 1; ?>">Next &raquo;</a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div id="addModal" class="hwpc-modal">
                <div class="hwpc-modal-content">
                    <h2>Add New Subscriber</h2>
                    <form method="post">
                        <?php wp_nonce_field('hwpc_add_subscriber'); ?>
                        <label><strong>Email Address</strong></label>
                        <input type="email" name="new_email" required placeholder="Enter email address">
                        
                        <label><strong>Language</strong></label>
                        <select name="new_locale">
                            <option value="bn">Bengali</option>
                            <option value="en">English</option>
                        </select>
                        
                        <div class="hwpc-modal-actions">
                            <button type="button" class="hwpc-btn hwpc-btn-secondary" onclick="document.getElementById('addModal').classList.remove('active')">Cancel</button>
                            <button type="submit" name="hwpc_add_subscriber" class="hwpc-btn hwpc-btn-primary">Add Subscriber</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <?php
    }
    
    public function verify_connection(WP_REST_Request $request) {
        $api_key = $request->get_param('api_key');
        
        if (!$api_key) {
            return new WP_Error('missing_key', 'API key is required', ['status' => 400]);
        }
        
        $stored_key = get_option($this->api_key_option);
        
        if (!hash_equals($stored_key, $api_key)) {
            return new WP_Error('invalid_key', 'Invalid API key', ['status' => 401]);
        }
        
        return rest_ensure_response([
            'success' => true,
            'site' => get_site_url(),
            'plugin_version' => HWPC_VERSION,
            'api_endpoints' => [
                'posts' => get_site_url() . '/wp-json/eyepress/v1/posts',
                'categories' => get_site_url() . '/wp-json/eyepress/v1/categories',
                'export' => get_site_url() . '/wp-json/headless/v1/export',
            ],
        ]);
    }
    
    public function add_admin_menu() {
        add_menu_page('Contact Messages', 'Contact Messages', 'manage_options', 'hwpc-contacts', [$this, 'contacts_page'], 'dashicons-admin-comments', 35);
        add_menu_page('Newsletter', 'Newsletter', 'manage_options', 'hwpc-newsletter', [$this, 'newsletter_page'], 'dashicons-email-alt', 30);
        add_options_page('Headless WP Connector', 'Headless Connector', 'manage_options', 'headless-wp-connector', [$this, 'options_page']);
    }
    
    public function settings_init() {
        register_setting('headless_wp_connector', $this->api_key_option);
        register_setting('headless_wp_connector', 'hwpc_site_logo');
        register_setting('headless_wp_connector', 'hwpc_site_icon');
        register_setting('headless_wp_connector', 'hwpc_urgent_notice');
        register_setting('headless_wp_connector', 'hwpc_youtube_url');
        register_setting('headless_wp_connector', 'hwpc_youtube_videos');
        register_setting('headless_wp_connector', 'hwpc_ads');
        register_setting('headless_wp_connector', 'hwpc_date_time_html_bn');
        register_setting('headless_wp_connector', 'hwpc_date_time_html_en');
        register_setting('headless_wp_connector', 'hwpc_ticker_html_bn');
        register_setting('headless_wp_connector', 'hwpc_ticker_html_en');
        
        if (!current_user_can('manage_options')) return;
        
        global $wpdb;
        
        if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $wpdb->delete($this->contacts_table, ['id' => $id]);
            echo '<div class="notice notice-success is-dismissible"><p>Message deleted!</p></div>';
        }
        
        if (isset($_GET['action']) && $_GET['action'] == 'mark-read' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $wpdb->update($this->contacts_table, ['status' => 'read'], ['id' => $id]);
            echo '<div class="notice notice-success is-dismissible"><p>Message marked as read!</p></div>';
        }
        
        if (isset($_POST['hwpc_delete_subscriber']) && check_admin_referer('hwpc_delete_' . $_POST['subscriber_id'])) {
            $id = intval($_POST['subscriber_id']);
            $wpdb->delete($this->subscriptions_table, ['id' => $id]);
            echo '<div class="notice notice-success is-dismissible"><p>Subscriber deleted!</p></div>';
        }
        
        if (isset($_POST['hwpc_add_subscriber']) && check_admin_referer('hwpc_add_subscriber')) {
            $email = sanitize_email($_POST['new_email']);
            $locale = sanitize_text_field($_POST['new_locale']);
            
            if ($email && is_email($email)) {
                $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$this->subscriptions_table} WHERE email = %s", $email));
                if (!$exists) {
                    $wpdb->insert($this->subscriptions_table, ['email' => $email, 'locale' => $locale, 'status' => 'active']);
                    echo '<div class="notice notice-success is-dismissible"><p>Subscriber added successfully!</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p>Email already exists!</p></div>';
                }
            }
        }
        
        if (isset($_GET['hwpc_export']) && $_GET['hwpc_export'] == 'csv') {
            $subscribers = $wpdb->get_results("SELECT * FROM {$this->subscriptions_table} ORDER BY subscribed_at DESC");
            
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename=subscribers-' . date('Y-m-d') . '.csv');
            
            $output = fopen('php://output', 'w');
            fputcsv($output, ['Email', 'Language', 'Status', 'Subscribed Date']);
            
            foreach ($subscribers as $s) {
                fputcsv($output, [$s->email, $s->locale, $s->status, $s->subscribed_at]);
            }
            
            fclose($output);
            exit;
        }
    }
    
    public function options_page() {
        if (isset($_POST['hwpc_generate_key'])) {
            check_admin_referer('hwpc_generate_key');
            $new_key = 'hwpc_' . bin2hex(random_bytes(32));
            update_option($this->api_key_option, $new_key);
            echo '<div class="notice notice-success"><p>New API key generated!</p></div>';
        }
        
        if (isset($_POST['hwpc_save_settings']) && current_user_can('manage_options')) {
            check_admin_referer('hwpc_settings');
            update_option('hwpc_site_logo', esc_url($_POST['hwpc_site_logo']));
            update_option('hwpc_site_icon', esc_url($_POST['hwpc_site_icon']));
            update_option('hwpc_urgent_notice', sanitize_text_field($_POST['hwpc_urgent_notice']));
            update_option('hwpc_youtube_url', esc_url($_POST['hwpc_youtube_url']));
            update_option('hwpc_youtube_videos', sanitize_textarea_field($_POST['hwpc_youtube_videos']));
            update_option('hwpc_ads', sanitize_textarea_field($_POST['hwpc_ads']));
            update_option('hwpc_date_time_html_bn', wp_kses_post($_POST['hwpc_date_time_html_bn']));
            update_option('hwpc_date_time_html_en', wp_kses_post($_POST['hwpc_date_time_html_en']));
            update_option('hwpc_ticker_html_bn', wp_kses_post($_POST['hwpc_ticker_html_bn']));
            update_option('hwpc_ticker_html_en', wp_kses_post($_POST['hwpc_ticker_html_en']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $current_key = get_option($this->api_key_option);
        $site_logo = get_option('hwpc_site_logo', '');
        $site_icon = get_option('hwpc_site_icon', '');
        $urgent_notice = get_option('hwpc_urgent_notice', '');
        $youtube_url = get_option('hwpc_youtube_url', 'https://www.youtube.com/@TheEyePress');
        $youtube_videos = get_option('hwpc_youtube_videos', '');
        $ads = get_option('hwpc_ads', '');
        $date_time_html_bn = get_option('hwpc_date_time_html_bn', '');
        $date_time_html_en = get_option('hwpc_date_time_html_en', '');
        $ticker_html_bn = get_option('hwpc_ticker_html_bn', '');
        $ticker_html_en = get_option('hwpc_ticker_html_en', '');
        
        $site_url = get_site_url();
        ?>
        <div class="wrap">
            <h1>Headless WP Connector v<?php echo HWPC_VERSION; ?></h1>
            
            <!-- API Key - TOP SECTION -->
            <div style="background: #e6f4ea; border: 2px solid #1e8e3e; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="color: #1e8e3e; margin-top: 0;">🔑 API Key (Required for WPCodingPress)</h2>
                <form method="post" style="margin-bottom: 15px;">
                    <?php wp_nonce_field('hwpc_generate_key'); ?>
                    <table class="form-table">
                        <tr>
                            <th>Your API Key</th>
                            <td>
                                <input type="text" value="<?php echo esc_attr($current_key ?: 'No API key generated yet'); ?>" class="large-text" readonly style="background: white; font-family: monospace;" />
                                <p class="description">Copy this key and paste it in your WPCodingPress dashboard to connect this site.</p>
                                <p class="description"><strong>Your Site URL:</strong> <code><?php echo $site_url; ?></code></p>
                            </td>
                        </tr>
                    </table>
                    <button type="submit" name="hwpc_generate_key" class="button button-primary">Generate New API Key</button>
                </form>
            </div>
            
            <form method="post" class="wp-core-ui">
                <?php wp_nonce_field('hwpc_settings'); ?>
                <h2>Site Settings</h2>
                <table class="form-table">
                    <tr>
                        <th>Site Logo URL</th>
                        <td>
                            <input type="url" name="hwpc_site_logo" value="<?php echo esc_attr($site_logo); ?>" class="regular-text" placeholder="https://example.com/logo.png" />
                            <p class="description">Enter the URL of your site logo image.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Site Icon URL</th>
                        <td>
                            <input type="url" name="hwpc_site_icon" value="<?php echo esc_attr($site_icon); ?>" class="regular-text" placeholder="https://example.com/icon.png" />
                            <p class="description">Enter the URL of your site icon (shown when scrolled).</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Urgent Notice</th>
                        <td>
                            <input type="text" name="hwpc_urgent_notice" value="<?php echo esc_attr($urgent_notice); ?>" class="regular-text" placeholder="Breaking news text" />
                            <p class="description">Enter a notice to display in the header.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>YouTube URL</th>
                        <td>
                            <input type="url" name="hwpc_youtube_url" value="<?php echo esc_attr($youtube_url); ?>" class="regular-text" placeholder="https://www.youtube.com/@ChannelName" />
                            <p class="description">Your YouTube channel URL for the LIVE button.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Featured Videos (YouTube URLs)</th>
                        <td>
                            <textarea name="hwpc_youtube_videos" rows="6" class="large-text" placeholder="https://www.youtube.com/watch?v=abc123&#10;https://www.youtube.com/watch?v=def456"><?php echo esc_textarea($youtube_videos); ?></textarea>
                            <p class="description">Enter one YouTube video URL per line. These will appear in the video slider on your site.</p>
                        </td>
                    </tr>
                </table>
                
                <h2>Advertisements</h2>
                <table class="form-table">
                    <tr>
                        <th>Ads Configuration</th>
                        <td>
                            <textarea name="hwpc_ads" rows="8" class="large-text" placeholder='ad_slot_1|image|https://example.com/ad1.png|https://example.com/link1&#10;ad_slot_2|image|https://example.com/ad2.png|https://example.com/link2'><?php echo esc_textarea($ads); ?></textarea>
                            <p class="description">Enter one ad per line in format: <code>slot_number|image_url|link_url</code></p>
                            <p class="description">Example: <code>1|https://example.com/ad.png|https://example.com</code></p>
                            <p class="description">Available slots: 1 (Below Hero), 2 (Above Footer), 5 (Top of Post), 6 (Bottom of Post), 7 (Top of Category), 8 (Bottom of Category), 9 (Search), 10 (Author Top), 11 (Author Bottom)</p>
                        </td>
                    </tr>
                </table>
                
                <h2>Custom HTML</h2>
                <table class="form-table">
                    <tr>
                        <th>Date/Time HTML (Bengali)</th>
                        <td>
                            <textarea name="hwpc_date_time_html_bn" rows="3" class="large-text" placeholder="<div class='date-time'>আজকের তারিখ: [date]</div>"><?php echo esc_textarea($date_time_html_bn); ?></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>Date/Time HTML (English)</th>
                        <td>
                            <textarea name="hwpc_date_time_html_en" rows="3" class="large-text" placeholder="<div class='date-time'>Today's Date: [date]</div>"><?php echo esc_textarea($date_time_html_en); ?></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>Ticker HTML (Bengali)</th>
                        <td>
                            <textarea name="hwpc_ticker_html_bn" rows="3" class="large-text"><?php echo esc_textarea($ticker_html_bn); ?></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>Ticker HTML (English)</th>
                        <td>
                            <textarea name="hwpc_ticker_html_en" rows="3" class="large-text"><?php echo esc_textarea($ticker_html_en); ?></textarea>
                        </td>
                    </tr>
                </table>
                <p>
                    <button type="submit" name="hwpc_save_settings" class="button button-primary">Save Settings</button>
                </p>
            </form>
            
            <hr>
            
            <h2>API Endpoints Available</h2>
            <p>Your WordPress site provides these REST API endpoints:</p>
            <ul>
                <li><code>/wp-json/eyepress/v1/posts</code> - Get all posts</li>
                <li><code>/wp-json/eyepress/v1/post/{slug}</code> - Get single post</li>
                <li><code>/wp-json/eyepress/v1/categories</code> - Get categories</li>
                <li><code>/wp-json/eyepress/v1/menus</code> - Get menus</li>
                <li><code>/wp-json/eyepress/v1/ticker</code> - Get ticker posts</li>
                <li><code>/wp-json/eyepress/v1/trending</code> - Get trending posts</li>
                <li><code>/wp-json/eyepress/v1/authors</code> - Get authors</li>
                <li><code>/wp-json/eyepress/v1/videos</code> - Get videos</li>
                <li><code>/wp-json/eyepress/v1/search</code> - Search posts</li>
                <li><code>/wp-json/eyepress/v1/contact</code> - Submit contact form</li>
                <li><code>/wp-json/eyepress/v1/guest-comment</code> - Submit guest comment</li>
                <li><code>/wp-json/eyepress/v1/login</code> - User login</li>
                <li><code>/wp-json/eyepress/v1/register</code> - User registration</li>
                <li><code>/wp-json/eyepress/v1/subscribe</code> - Subscribe to newsletter</li>
                <li><code>/wp-json/eyepress/v1/notifications</code> - Get comment notifications</li>
                <li><code>/wp-json/headless/v1/export</code> - Export all data (requires API key)</li>
            </ul>
            
            <hr>
            
            <h2>Database Tables</h2>
            <p>This plugin creates the following database tables:</p>
            <ul>
                <li><strong>eyepress_contacts</strong> - Stores contact form submissions</li>
                <li><strong>eyepress_comment_notifications</strong> - Stores comment notifications</li>
                <li><strong>eyepress_subscriptions</strong> - Stores newsletter subscriptions</li>
            </ul>
        </div>
        <?php
    }
}

new Headless_WP_Connector();
