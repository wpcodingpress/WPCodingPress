-- ================================================
-- WPCODINGPRESS DATABASE SCHEMA
-- Complete Database for PHP API + Next.js
-- ================================================

-- Drop existing tables (for fresh install)
DROP TABLE IF EXISTS `admin_users`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `portfolio`;
DROP TABLE IF EXISTS `api_logs`;

-- ================================================
-- ADMIN USERS TABLE
-- ================================================
CREATE TABLE `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- SERVICES TABLE
-- ================================================
CREATE TABLE `services` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `description` TEXT,
    `icon` VARCHAR(50) DEFAULT 'code',
    `basic_price` INT DEFAULT 0,
    `standard_price` INT DEFAULT 0,
    `premium_price` INT DEFAULT 0,
    `basic_features` JSON,
    `standard_features` JSON,
    `premium_features` JSON,
    `sort_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`),
    INDEX `idx_active` (`is_active`),
    INDEX `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- ORDERS TABLE
-- ================================================
CREATE TABLE `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `service_id` INT NOT NULL,
    `client_name` VARCHAR(150) NOT NULL,
    `client_email` VARCHAR(150) NOT NULL,
    `client_phone` VARCHAR(50),
    `package_type` ENUM('basic', 'standard', 'premium') DEFAULT 'standard',
    `message` TEXT,
    `budget` VARCHAR(50),
    `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    `admin_notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE RESTRICT,
    INDEX `idx_service` (`service_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_email` (`client_email`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- CONTACTS TABLE
-- ================================================
CREATE TABLE `contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50),
    `subject` VARCHAR(255),
    `message` TEXT NOT NULL,
    `is_read` TINYINT(1) DEFAULT 0,
    `is_replied` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_read` (`is_read`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- PORTFOLIO TABLE
-- ================================================
CREATE TABLE `portfolio` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500),
    `description` TEXT,
    `client` VARCHAR(150),
    `url` VARCHAR(500),
    `technologies` JSON,
    `sort_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_category` (`category`),
    INDEX `idx_active` (`is_active`),
    INDEX `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- API LOGS TABLE (For Security Monitoring)
-- ================================================
CREATE TABLE `api_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `endpoint` VARCHAR(255) NOT NULL,
    `method` VARCHAR(10) NOT NULL,
    `ip_address` VARCHAR(50),
    `user_agent` TEXT,
    `request_data` JSON,
    `response_code` INT,
    `user_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_endpoint` (`endpoint`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- INSERT DEFAULT ADMIN USER
-- Password: S0pnahenayf
-- ================================================
INSERT INTO `admin_users` (`name`, `email`, `password`, `role`) VALUES
('Rahman', 'rahman.ceo@wpcodingpress.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ================================================
-- INSERT DEFAULT SERVICES
-- ================================================
INSERT INTO `services` (`name`, `slug`, `description`, `icon`, `basic_price`, `standard_price`, `premium_price`, `basic_features`, `standard_features`, `premium_features`, `sort_order`) VALUES
('WordPress Development', 'wordpress-development', 'Custom WordPress solutions built for performance, security, and scalability.', 'code', 150, 300, 500, '["5 Pages","Elementor Design","Mobile Responsive","Contact Form","Basic SEO"]', '["10 Pages","WooCommerce Setup","Payment Integration","Speed Optimization","Priority Support"]', '["Unlimited Pages","Custom Development","Booking System","Stripe/PayPal","24/7 Support"]', 1),
('Elementor Pro Design', 'elementor-pro', 'Stunning, conversion-focused designs using Elementor page builder.', 'palette', 100, 200, 350, '["5 Sections","Custom Header/Footer","Mobile Responsive","Contact Form","Basic Animations"]', '["10 Sections","Popups & Forms","WooCommerce Elements","Custom Widgets","Advanced Animations"]', '["Full Website","Custom CSS/JS","Dynamic Content","Template Library","Priority Support"]', 2),
('WooCommerce Store', 'woocommerce', 'Full-featured e-commerce solutions with payment integration.', 'shopping-cart', 250, 450, 700, '["Up to 20 Products","Payment Gateway","Cart & Checkout","Mobile Responsive","Basic Reports"]', '["Up to 100 Products","Inventory System","Shipping Options","Coupons & Discounts","Email Marketing"]', '["Unlimited Products","Subscriptions","Multi-vendor","Advanced Analytics","API Integration"]', 3),
('Website Redesign', 'website-redesign', 'Modernize your existing website with cutting-edge design.', 'zap', 200, 400, 600, '["UI Refresh","Mobile Optimization","Content Migration","Speed Boost","3-5 Pages"]', '["Full Redesign","UX Improvements","SEO Preservation","New Features","10-15 Pages"]', '["Complete Overhaul","Custom Design","Advanced Features","CMS Training","Ongoing Support"]', 4);

-- ================================================
-- INSERT SAMPLE PORTFOLIO
-- ================================================
INSERT INTO `portfolio` (`title`, `category`, `image_url`, `description`, `technologies`, `sort_order`) VALUES
('Medical Spa Website', 'Healthcare', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80', 'Complete medical spa website with booking system', '["WordPress","Elementor Pro","WooCommerce"]', 1),
('E-commerce Fashion Store', 'E-commerce', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', 'WooCommerce store with modern design', '["WooCommerce","Stripe","PayPal"]', 2),
('Law Firm Portal', 'Professional Services', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80', 'Corporate website with case management', '["WordPress","Custom Theme","CRM Integration"]', 3),
('Restaurant Booking App', 'Food & Beverage', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', 'Online ordering and reservation system', '["WordPress","WooCommerce","Custom Plugin"]', 4),
('Real Estate Platform', 'Real Estate', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'Property listings with virtual tours', '["WordPress","IDX","VR Integration"]', 5);

-- ================================================
-- BLOG POSTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS `blog_posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` TEXT,
    `content` LONGTEXT,
    `cover_image` VARCHAR(500),
    `author` VARCHAR(100),
    `category` VARCHAR(100),
    `tags` VARCHAR(255),
    `reading_time` INT DEFAULT 5,
    `is_published` TINYINT(1) DEFAULT 1,
    `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_slug` (`slug`),
    INDEX `idx_category` (`category`),
    INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- INSERT SAMPLE BLOG POSTS (SEO Optimized)
-- ================================================
INSERT INTO `blog_posts` (`slug`, `title`, `excerpt`, `content`, `cover_image`, `author`, `category`, `tags`, `reading_time`) VALUES
('wordpress-seo-guide-2024', 'Complete WordPress SEO Guide: Rank #1 on Google in 2024', 'Learn the proven WordPress SEO strategies that will help your website rank higher on Google. This comprehensive guide covers everything from technical SEO to content optimization.', 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb01?w=800&q=80', 'WPCodingPress Team', 'Development', 'wordpress,seo,google,ranking,optimization', 8),
('grow-business-online-2024', 'How to Grow Your Business Online: Complete Digital Strategy', 'Discover the proven digital strategies that successful businesses use to grow their online presence. From website optimization to social media marketing, learn it all here.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'WPCodingPress Team', 'Business', 'business,digital marketing,growth,online strategy', 6),
('woocommerce-conversion-optimization', 'WooCommerce Conversion Optimization: Turn Visitors into Buyers', 'Master the art of WooCommerce conversion optimization. Learn how to optimize your online store to increase sales and revenue with proven strategies.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'WPCodingPress Team', 'Development', 'woocommerce,ecommerce,conversion,sales,optimization', 7);
