CREATE TABLE `practicum_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`course_id` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`file_path` varchar(255),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	CONSTRAINT `practicum_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduled_practicums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`course_id` int NOT NULL,
	`room_id` int NOT NULL,
	`created_by` int NOT NULL,
	`semester` varchar(50) NOT NULL,
	`week_number` int NOT NULL,
	`day_of_week` int NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`end_time` varchar(5) NOT NULL,
	`scheduled_date` datetime,
	`topic` varchar(255),
	`status` enum('Aktif','Dibatalkan') DEFAULT 'Aktif',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `scheduled_practicums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`link` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `hero_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publication_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publication_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `publication_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploader_id` int,
	`submitter_id` int,
	`author_name` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`abstract` text,
	`keywords` text,
	`file_path` varchar(255),
	`link` varchar(255),
	`view_count` int NOT NULL DEFAULT 0,
	`status` enum('Pending','Published','Rejected') NOT NULL DEFAULT 'Pending',
	`publish_date` datetime,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lab_attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`room_id` int NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`dosen_penanggung_jawab` varchar(255),
	`check_in_time` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `lab_attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `academic_docs`;--> statement-breakpoint
DROP TABLE `class_enrollments`;--> statement-breakpoint
DROP TABLE `classes`;--> statement-breakpoint
DROP TABLE `modules`;--> statement-breakpoint
DROP TABLE `practical_reports`;--> statement-breakpoint
DROP TABLE `practical_sessions`;--> statement-breakpoint
DROP TABLE `student_publications`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password_hash` varchar(255);--> statement-breakpoint
ALTER TABLE `courses` ADD `sks` int DEFAULT 3;--> statement-breakpoint
ALTER TABLE `courses` ADD `semester` varchar(50);--> statement-breakpoint
ALTER TABLE `courses` ADD `lecturer_id` int;--> statement-breakpoint
ALTER TABLE `courses` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `item_loans` ADD `organisasi` varchar(255);--> statement-breakpoint
ALTER TABLE `item_loans` ADD `start_time` datetime;--> statement-breakpoint
ALTER TABLE `item_loans` ADD `end_time` datetime;--> statement-breakpoint
ALTER TABLE `item_loans` ADD `purpose` varchar(255);--> statement-breakpoint
ALTER TABLE `item_loans` ADD `surat_izin` varchar(255);--> statement-breakpoint
ALTER TABLE `item_loans` ADD `dosen_pembimbing` varchar(255);--> statement-breakpoint
ALTER TABLE `item_loans` ADD `software` text;--> statement-breakpoint
ALTER TABLE `item_loans` ADD `notification_read` enum('0','1') DEFAULT '0';--> statement-breakpoint
ALTER TABLE `item_loans` ADD `return_photo` varchar(255);--> statement-breakpoint
ALTER TABLE `item_loans` ADD `return_status` enum('Belum','Pending','Dikembalikan') DEFAULT 'Belum';--> statement-breakpoint
ALTER TABLE `item_loans` ADD `return_notification_read` enum('0','1') DEFAULT '0';--> statement-breakpoint
ALTER TABLE `room_bookings` ADD `organisasi` varchar(255) DEFAULT 'Pribadi';--> statement-breakpoint
ALTER TABLE `room_bookings` ADD `jumlah_peserta` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `room_bookings` ADD `surat_permohonan` varchar(255);--> statement-breakpoint
ALTER TABLE `room_bookings` ADD `dosen_pembimbing` varchar(255);--> statement-breakpoint
ALTER TABLE `room_bookings` ADD `notification_read` enum('0','1') DEFAULT '0';--> statement-breakpoint
ALTER TABLE `rooms` ADD `status` enum('Tersedia','Maintenance') DEFAULT 'Tersedia';--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('Active','Pending','Rejected','Pre-registered') DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE `users` ADD `batch` int;--> statement-breakpoint
ALTER TABLE `users` ADD `study_type` enum('Reguler','Hybrid') DEFAULT 'Reguler';--> statement-breakpoint
ALTER TABLE `users` ADD `program_studi` varchar(100) DEFAULT 'Informatika';--> statement-breakpoint
ALTER TABLE `users` ADD `dosen_pembimbing` varchar(255);--> statement-breakpoint
ALTER TABLE `practicum_modules` ADD CONSTRAINT `practicum_modules_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduled_practicums` ADD CONSTRAINT `scheduled_practicums_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduled_practicums` ADD CONSTRAINT `scheduled_practicums_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduled_practicums` ADD CONSTRAINT `scheduled_practicums_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_likes` ADD CONSTRAINT `publication_likes_publication_id_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `publications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publication_likes` ADD CONSTRAINT `publication_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publications` ADD CONSTRAINT `publications_uploader_id_users_id_fk` FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publications` ADD CONSTRAINT `publications_submitter_id_users_id_fk` FOREIGN KEY (`submitter_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lab_attendance` ADD CONSTRAINT `lab_attendance_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lab_attendance` ADD CONSTRAINT `lab_attendance_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `course_idx` ON `practicum_modules` (`course_id`);--> statement-breakpoint
CREATE INDEX `sp_course_idx` ON `scheduled_practicums` (`course_id`);--> statement-breakpoint
CREATE INDEX `sp_room_idx` ON `scheduled_practicums` (`room_id`);--> statement-breakpoint
CREATE INDEX `sp_created_by_idx` ON `scheduled_practicums` (`created_by`);--> statement-breakpoint
CREATE INDEX `sp_semester_idx` ON `scheduled_practicums` (`semester`);--> statement-breakpoint
CREATE INDEX `publication_idx` ON `publication_likes` (`publication_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `publication_likes` (`user_id`);--> statement-breakpoint
CREATE INDEX `unique_like` ON `publication_likes` (`publication_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `uploader_idx` ON `publications` (`uploader_id`);--> statement-breakpoint
CREATE INDEX `submitter_idx` ON `publications` (`submitter_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `publications` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `lab_attendance` (`user_id`);--> statement-breakpoint
CREATE INDEX `room_idx` ON `lab_attendance` (`room_id`);--> statement-breakpoint
CREATE INDEX `check_in_time_idx` ON `lab_attendance` (`check_in_time`);--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_lecturer_id_users_id_fk` FOREIGN KEY (`lecturer_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `governance_docs` ADD CONSTRAINT `governance_docs_admin_id_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_loans` ADD CONSTRAINT `item_loans_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_loans` ADD CONSTRAINT `item_loans_item_id_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item_loans` ADD CONSTRAINT `item_loans_validator_id_users_id_fk` FOREIGN KEY (`validator_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_item_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `item_categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_bookings` ADD CONSTRAINT `room_bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_bookings` ADD CONSTRAINT `room_bookings_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_bookings` ADD CONSTRAINT `room_bookings_validator_id_users_id_fk` FOREIGN KEY (`validator_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lecturer_idx` ON `courses` (`lecturer_id`);--> statement-breakpoint
CREATE INDEX `admin_idx` ON `governance_docs` (`admin_id`);--> statement-breakpoint
CREATE INDEX `student_idx` ON `item_loans` (`student_id`);--> statement-breakpoint
CREATE INDEX `item_idx` ON `item_loans` (`item_id`);--> statement-breakpoint
CREATE INDEX `validator_idx` ON `item_loans` (`validator_id`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `items` (`category_id`);--> statement-breakpoint
CREATE INDEX `room_idx` ON `items` (`room_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `room_bookings` (`user_id`);--> statement-breakpoint
CREATE INDEX `room_idx` ON `room_bookings` (`room_id`);--> statement-breakpoint
CREATE INDEX `validator_idx` ON `room_bookings` (`validator_id`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role_id`);--> statement-breakpoint
CREATE INDEX `batch_idx` ON `users` (`batch`);