<?php
/**
 * Plugin Name: Headless WP Connector (Enhanced)
 * Plugin URI: https://wpcodingpress.com
 * Description: Connect your WordPress site to WPCodingPress SaaS - Export data compatible with Next.js headless template
 * Version: 2.0.0
 * Author: WPCodingPress
 * Author URI: https://wpcodingpress.com
 * License: GPL v2 or later
 * Text Domain: headless-wp-connector
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HWPC_VERSION', '2.0.0');

class Headless_WP_Connector {
    
    private $option_name = 'headless_wp_connector';
    private $api_key_option = 'hwpc_api_key';
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'settings_init']);
    }
    
    public function register_routes() {
        register_rest_route('eyepress/v1', '/posts', [
            'methods' => 'GET',
            'callback' => [$this, 'get_posts'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/post/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_post'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/categories', [
            'methods' => 'GET',
            'callback' => [$this, 'get_categories'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/category/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_category_posts'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menus'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/site-options', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_options'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/search', [
            'methods' => 'GET',
            'callback' => [$this, 'search_posts'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/stats', [
            'methods' => 'GET',
            'callback' => [$this, 'get_stats'],
            'permission_callback' => [$this, 'check_api_key'],
        ]);
        
        register_rest_route('eyepress/v1', '/ticker', [
            'methods' => 'GET',
            'callback' => [$this, 'get_ticker'],
            'permission_callback' => [$this, 'check_api_key'],
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
        $provided_key = $request->get_header('X-API-Key');
        
        if (!$provided_key) {
            $provided_key = $request->get_param('api_key');
        }
        
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
        
        $post = $this->format_post($posts[0]);
        
        return rest_ensure_response($post);
    }
    
    public function get_categories(WP_REST_Request $request) {
        $categories = get_categories([
            'hide_empty' => false,
            'orderby' => 'count',
            'order' => 'DESC',
        ]);
        
        $formatted = array_map(function($cat) {
            return [
                'id' => $cat->term_id,
                'name' => $cat->name,
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
        $locations = get_nav_menu_locations();
        $menus = [];
        
        foreach ($locations as $location => $menu_id) {
            if ($menu_id) {
                $menu = wp_get_nav_menu_object($menu_id);
                $items = wp_get_nav_menu_items($menu_id);
                
                $formatted_items = array_map(function($item) {
                    return [
                        'id' => $item->ID,
                        'title' => $item->title,
                        'url' => $item->url,
                        'target' => $item->target,
                        'children' => [],
                    ];
                }, $items);
                
                $menus[$location] = [
                    'name' => $menu->name,
                    'items' => $formatted_items,
                ];
            }
        }
        
        return rest_ensure_response($menus);
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
    
    public function export_all_data(WP_REST_Request $request) {
        $posts = get_posts([
            'numberposts' => -1,
            'post_status' => 'publish',
        ]);
        
        $pages = get_pages([
            'post_status' => 'publish',
        ]);
        
        $categories = get_categories(['hide_empty' => false]);
        
        $media = get_posts([
            'post_type' => 'attachment',
            'numberposts' => -1,
        ]);
        
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
                    'site_options' => '/site-options',
                    'search' => '/search?q={query}',
                    'stats' => '/stats',
                    'ticker' => '/ticker?count=10',
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
                    return [
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                    ];
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
        add_options_page(
            'Headless WP Connector',
            'Headless Connector',
            'manage_options',
            'headless-wp-connector',
            [$this, 'options_page']
        );
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
        
        if (isset($_POST['hwpc_save_api_url'])) {
            check_admin_referer('hwpc_save_api_url');
            update_option('hwpc_api_url', sanitize_text_field($_POST['api_url']));
            echo '<div class="notice notice-success"><p>API URL saved!</p></div>';
        }
        
        $current_key = get_option($this->api_key_option);
        $api_url = get_option('hwpc_api_url', get_site_url());
        ?>
        <div class="wrap">
            <h1>Headless WP Connector v<?php echo HWPC_VERSION; ?></h1>
            <form method="post">
                <?php wp_nonce_field('hwpc_generate_key'); ?>
                <table class="form-table">
                    <tr>
                        <th>API Key</th>
                        <td>
                            <input type="text" name="api_key_display" 
                                   value="<?php echo esc_attr($current_key ?: 'No API key generated'); ?>" 
                                   class="regular-text" readonly />
                            <p class="description">Use this key in your WPCodingPress dashboard to connect this site.</p>
                        </td>
                    </tr>
                </table>
                <p>
                    <button type="submit" name="hwpc_generate_key" class="button button-primary">
                        Generate New API Key
                    </button>
                </p>
            </form>
            
            <hr>
            
            <h2>API Endpoints Available</h2>
            <p>Your WordPress site provides these REST API endpoints:</p>
            <ul>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/posts</code> - Get all posts</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/post/{slug}</code> - Get single post</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/categories</code> - Get categories</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/category/{slug}</code> - Get posts by category</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/menus</code> - Get menus</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/site-options</code> - Get site options</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/eyepress/v1/search</code> - Search posts</li>
                <li><code><?php echo get_site_url(); ?>/wp-json/headless/v1/export</code> - Export all data (for conversion)</li>
            </ul>
            
            <hr>
            
            <h2>How to Connect</h2>
            <ol>
                <li>Copy the API key above</li>
                <li>Go to <a href="https://wpcodingpress.onrender.com/dashboard/sites" target="_blank">WPCodingPress Dashboard</a></li>
                <li>Add a new site and paste the API key</li>
                <li>Your site will be connected automatically</li>
            </ol>
        </div>
        <?php
    }
}

new Headless_WP_Connector();
