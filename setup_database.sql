-- ===================================================================
-- YASA GRAPHICS DATABASE SETUP
-- Database: yasagraphicsdb
-- ===================================================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS yasagraphicsdb;
USE yasagraphicsdb;

-- ===================================================================
-- TABLE 1: designs
-- ===================================================================
-- Description: Stores design listing information
CREATE TABLE IF NOT EXISTS designs (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  category VARCHAR(100),
  price_lkr INT,
  image LONGTEXT,
  video LONGTEXT,
  badge VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_category (category),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 2: users (for future admin management)
-- ===================================================================
-- Description: Stores admin user credentials
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 2.5: Profiling (Gallery Items)
-- ===================================================================
-- Description: Stores gallery items with images, videos, and URLs
CREATE TABLE IF NOT EXISTS Profiling (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  description VARCHAR(500),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_category (category),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 3: gallery_items
-- ===================================================================
-- Description: Stores gallery items with images, videos, and links
CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  subtitle VARCHAR(255),
  image VARCHAR(500),
  video VARCHAR(500),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_category (category),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 4: portfolio_items
-- ===================================================================
-- Description: Stores portfolio showcase items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img VARCHAR(500),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 5: navbar_settings
-- ===================================================================
-- Description: Stores navbar configuration
CREATE TABLE IF NOT EXISTS navbar_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  display_status BOOLEAN DEFAULT TRUE,
  marquee_text LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY idx_single_row (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- INSERT SAMPLE DATA (Optional - Remove if you have existing data)
-- ===================================================================

-- Insert initial navbar settings
INSERT IGNORE INTO navbar_settings (id, display_status, marquee_text) 
VALUES (1, TRUE, '📢 Welcome to Yasa Graphics — Expert Design Solutions!');

-- ===================================================================
-- NOTES:
-- ===================================================================
-- 1. Run this script in phpMyAdmin under yasagraphicsdb
-- 2. All tables are created with IF NOT EXISTS, so it's safe to run multiple times
-- 3. Images and videos in 'designs' table use LONGTEXT for base64 encoded data
-- 4. File paths in 'gallery_items' use VARCHAR(500) for uploaded file references
-- 5. All tables have timestamps for created_at and updated_at
-- ===================================================================
