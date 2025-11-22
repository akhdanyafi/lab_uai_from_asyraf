CREATE TABLE `academic_docs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`uploader_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`file_path` varchar(255) NOT NULL,
	`type` enum('Modul Praktikum','Laporan Praktikum') NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `academic_docs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `governance_docs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`file_path` varchar(255) NOT NULL,
	`type` enum('SOP','LPJ Bulanan') NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `governance_docs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `item_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_loans` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`item_id` int NOT NULL,
	`validator_id` int,
	`request_date` datetime DEFAULT CURRENT_TIMESTAMP,
	`return_plan_date` datetime NOT NULL,
	`actual_return_date` datetime,
	`status` enum('Pending','Disetujui','Ditolak','Selesai','Terlambat') DEFAULT 'Pending',
	CONSTRAINT `item_loans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`room_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`qr_code` varchar(255) NOT NULL,
	`status` enum('Tersedia','Dipinjam','Maintenance') DEFAULT 'Tersedia',
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `items_qr_code_unique` UNIQUE(`qr_code`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `room_bookings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`room_id` int NOT NULL,
	`validator_id` int,
	`start_time` datetime NOT NULL,
	`end_time` datetime NOT NULL,
	`purpose` text NOT NULL,
	`status` enum('Pending','Disetujui','Ditolak') DEFAULT 'Pending',
	CONSTRAINT `room_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`capacity` int NOT NULL,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_publications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`abstract` text,
	`link` varchar(255),
	`publish_date` datetime,
	CONSTRAINT `student_publications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`identifier` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_identifier_unique` UNIQUE(`identifier`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
