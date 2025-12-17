-- Add discount columns to designs table if they don't exist
ALTER TABLE designs ADD COLUMN discount_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE designs ADD COLUMN discount_percentage INT DEFAULT 0;

-- Verify the columns were added
DESCRIBE designs;
