-- Add url column to Profiling table if it doesn't exist
ALTER TABLE Profiling ADD COLUMN url VARCHAR(500) NULL DEFAULT NULL;

-- Verify the column was added
DESCRIBE Profiling;
