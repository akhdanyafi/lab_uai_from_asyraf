CREATE TABLE `class_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`class_id` int NOT NULL,
	`student_id` int NOT NULL,
	CONSTRAINT `class_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`course_id` int NOT NULL,
	`lecturer_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`semester` varchar(50) NOT NULL,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`course_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`file_path` varchar(255) NOT NULL,
	`order` int NOT NULL,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practical_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`student_id` int NOT NULL,
	`file_path` varchar(255) NOT NULL,
	`submission_date` datetime DEFAULT CURRENT_TIMESTAMP,
	`grade` int,
	`feedback` text,
	CONSTRAINT `practical_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practical_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`class_id` int NOT NULL,
	`module_id` int NOT NULL,
	`start_date` datetime NOT NULL,
	`deadline` datetime NOT NULL,
	`is_open` boolean DEFAULT true,
	CONSTRAINT `practical_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `academic_docs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `academic_docs` MODIFY COLUMN `type` enum('Modul Praktikum','Laporan Praktikum','Jurnal Publikasi') NOT NULL;--> statement-breakpoint
ALTER TABLE `governance_docs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `item_categories` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `item_loans` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `items` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `room_bookings` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `student_publications` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `academic_docs` ADD `subject` varchar(255);--> statement-breakpoint
ALTER TABLE `governance_docs` ADD `cover_path` varchar(255);