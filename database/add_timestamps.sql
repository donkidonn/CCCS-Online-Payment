-- Add created_at and updated_at columns to accounts table if they don't exist

-- Check if columns exist and add them
SET @exist_created := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts' AND COLUMN_NAME = 'created_at');

SET @exist_updated := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts' AND COLUMN_NAME = 'updated_at');

SET @query_created = IF(@exist_created = 0, 
  'ALTER TABLE accounts ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 
  'SELECT "created_at column already exists"');

SET @query_updated = IF(@exist_updated = 0, 
  'ALTER TABLE accounts ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 
  'SELECT "updated_at column already exists"');

PREPARE stmt_created FROM @query_created;
EXECUTE stmt_created;
DEALLOCATE PREPARE stmt_created;

PREPARE stmt_updated FROM @query_updated;
EXECUTE stmt_updated;
DEALLOCATE PREPARE stmt_updated;

