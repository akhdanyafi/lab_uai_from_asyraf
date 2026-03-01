-- Migration: Refactor practicum schema
-- 1. Change courses.semester from varchar to enum (Ganjil/Genap)
-- 2. Remove semester column from scheduled_practicums
-- 3. dayOfWeek remains in DB but is now auto-computed from scheduledDate

-- Step 1: Update courses.semester to enum
ALTER TABLE courses MODIFY COLUMN semester ENUM('Ganjil', 'Genap') NULL;

-- Step 2: Drop semester index and column from scheduled_practicums
ALTER TABLE scheduled_practicums DROP INDEX sp_semester_idx;
ALTER TABLE scheduled_practicums DROP COLUMN semester;
