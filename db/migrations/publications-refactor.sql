-- Publications Refactor Migration
-- 1. Add new date columns
-- 2. Migrate existing publishDate data
-- 3. Remove old columns (publishDate, submitterId, status)

-- Step 1: Add new columns
ALTER TABLE publications ADD COLUMN publish_year INT NULL AFTER view_count;
ALTER TABLE publications ADD COLUMN publish_month INT NULL AFTER publish_year;
ALTER TABLE publications ADD COLUMN publish_day INT NULL AFTER publish_month;

-- Step 2: Migrate existing data from publish_date
UPDATE publications
SET publish_year = YEAR(publish_date),
    publish_month = MONTH(publish_date),
    publish_day = DAY(publish_date)
WHERE publish_date IS NOT NULL;

-- Step 3: Drop old columns and indexes
ALTER TABLE publications DROP INDEX submitter_idx;
ALTER TABLE publications DROP INDEX status_idx;
ALTER TABLE publications DROP COLUMN publish_date;
ALTER TABLE publications DROP COLUMN submitter_id;
ALTER TABLE publications DROP COLUMN status;
