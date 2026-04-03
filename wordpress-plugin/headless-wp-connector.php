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

define('HWPC_VERSION', '3.0.0');

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
        
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'settings_init']);
        add_action('wp_insert_comment', [$this, 'track_new_comment'], 99, 2);
        add_action('transition_comment_status', [$this, 'track_comment_status_change'], 99, 3);
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
            subscribed tinyint(1) DEFAULT 1,
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
        return rest_ensure_response([
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => get_site_url(),
            'language' => get_bloginfo('language'),
            'charset' => get_bloginfo('charset'),
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
            if ($existing->subscribed) {
                return ['success' => false, 'message' => 'Email already subscribed'];
            }
            $wpdb->update($this->subscriptions_table, 
                ['subscribed' => 1, 'subscribed_at' => current_time('mysql'), 'unsubscribed_at' => null],
                ['email' => $email]
            );
            return ['success' => true, 'message' => 'Successfully resubscribed!'];
        }
        
        $wpdb->insert($this->subscriptions_table, [
            'email' => $email,
            'locale' => $locale,
            'subscribed' => 1,
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
            'subscribed' => $sub && $sub->subscribed ? true : false,
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
            ['subscribed' => 0, 'unsubscribed_at' => current_time('mysql')],
            ['email' => $email]
        );
        
        return ['success' => true, 'message' => 'Successfully unsubscribed'];
    }
    
    public function resubscribe(WP_REST_Request $request) {
        return $this->subscribe($request);
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
        add_options_page('Headless WP Connector', 'Headless Connector', 'manage_options', 'headless-wp-connector', [$this, 'options_page']);
    }
    
    public function settings_init() {
        register_setting('headless_wp_connector', $this->api_key_option);
    }
    
    public function options_page() {
        if (isset($_POST['hwpc_generate_key'])) {
            check_admin_referer('hwpc_generate_key');
            $new_key = 'hwpc_' . bin2hex(random_bytes(32));
            update_option($this->api_key_option, $new_key);
            echo '<div class="notice notice-success"><p>New API key generated!</p></div>';
        }
        
        $current_key = get_option($this->api_key_option);
        ?>
        <div class="wrap">
            <h1>Headless WP Connector v<?php echo HWPC_VERSION; ?></h1>
            <form method="post">
                <?php wp_nonce_field('hwpc_generate_key'); ?>
                <table class="form-table">
                    <tr>
                        <th>API Key</th>
                        <td>
                            <input type="text" name="api_key_display" value="<?php echo esc_attr($current_key ?: 'No API key generated'); ?>" class="regular-text" readonly />
                            <p class="description">Use this key in your WPCodingPress dashboard to connect this site.</p>
                        </td>
                    </tr>
                </table>
                <p>
                    <button type="submit" name="hwpc_generate_key" class="button button-primary">Generate New API Key</button>
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
                <li><code>/wp-json/headless/v1/export</code> - Export all data</li>
            </ul>
        </div>
        <?php
    }
}

new Headless_WP_Connector();
