CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`service` text NOT NULL,
	`description` text NOT NULL,
	`time` text NOT NULL,
	`tool` text NOT NULL,
	`status` text DEFAULT 'Шинэ' NOT NULL,
	`created` integer NOT NULL,
	`user_id` text NOT NULL
);
