-- Run this in phpMyAdmin to add missing columns to designs table

-- Add image column if it doesn't exist
ALTER TABLE designs ADD COLUMN image LONGTEXT AFTER price_lkr;

-- Add video column if it doesn't exist  
ALTER TABLE designs ADD COLUMN video LONGTEXT AFTER image;

-- Add starting column (stored in badge) - already exists
-- ALTER TABLE designs ADD COLUMN badge VARCHAR(100) DEFAULT NULL;

-- Verify the table structure
DESCRIBE designs;
