<?php
/**
 * Plugin Name: Headless WP Connector
 * Plugin URI: https://wpcodingpress.com
 * Description: Connect your WordPress site to WPCodingPress SaaS for headless conversion
 * Version: 1.0.0
 * Author: WPCodingPress
 * Author URI: https://wpcodingpress.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: headless-wp-connector
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HWPC_VERSION', '1.0.0');
define('HWPC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HWPC_PLUGIN_URL', plugin_dir_url(__FILE__));

class Headless_WP_Connector {
    
    private $option_name = 'headless_wp_connector';
    private $api_key_option = 'hwpc_api_key';
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'settings_init']);
    }
    
    public function register_routes() {
        register_rest_route('headless/v1', '/export', [
            'methods' => 'GET',
            'callback' => [$this, 'export_data'],
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
            return new WP_Error('no_api_key', 'API key is required', ['status' => 401]);
        }
        
        $stored_key = get_option($this->api_key_option);
        
        if (!$stored_key || !hash_equals($stored_key, $provided_key)) {
            return new WP_Error('invalid_api_key', 'Invalid API key', ['status' => 401]);
        }
        
        return true;
    }
    
    public function export_data(WP_REST_Request $request) {
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
                'exported_at' => current_time('mysql'),
            ],
        ];
        
        return rest_ensure_response($export_data);
    }
    
    private function format_post($post) {
        return [
            'id' => $post->ID,
            'title' => html_entity_decode($post->post_title),
            'content' => $post->post_content,
            'excerpt' => $post->post_excerpt,
            'slug' => $post->post_name,
            'date' => $post->post_date,
            'modified' => $post->post_modified,
            'status' => $post->post_status,
            'author' => get_the_author_meta('display_name', $post->post_author),
            'categories' => wp_get_post_categories($post->ID, ['fields' => 'names']),
            'tags' => wp_get_post_tags($post->ID, ['fields' => 'names']),
            'featured_image' => get_the_post_thumbnail_url($post->ID, 'full'),
            'seo_title' => get_post_meta($post->ID, '_yoast_wpseo_title', true) ?: get_post_meta($post->ID, 'Rank_Math_title', true),
            'seo_description' => get_post_meta($post->ID, '_yoast_wpseo_metadesc', true) ?: get_post_meta($post->ID, 'Rank_Math_description', true),
        ];
    }
    
    private function format_page($page) {
        return [
            'id' => $page->ID,
            'title' => html_entity_decode($page->post_title),
            'content' => $page->post_content,
            'slug' => $page->post_name,
            'template' => get_page_template_slug($page->ID),
            'seo_title' => get_post_meta($page->ID, '_yoast_wpseo_title', true) ?: get_post_meta($page->ID, 'Rank_Math_title', true),
            'seo_description' => get_post_meta($page->ID, '_yoast_wpseo_metadesc', true) ?: get_post_meta($page->ID, 'Rank_Math_description', true),
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
        
        $current_key = get_option($this->api_key_option);
        ?>
        <div class="wrap">
            <h1>Headless WP Connector</h1>
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
            
            <h2>How to Connect</h2>
            <ol>
                <li>Copy the API key above</li>
                <li>Go to <a href="https://wpcodingpress.com/dashboard/sites" target="_blank">WPCodingPress Dashboard</a></li>
                <li>Add a new site and paste the API key</li>
                <li>Your site will be connected automatically</li>
            </ol>
        </div>
        <?php
    }
}

new Headless_WP_Connector();