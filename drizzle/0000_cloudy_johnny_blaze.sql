CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`readiness_stage` text DEFAULT 'Structured concept' NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	`document_key` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_owner_idx` ON `projects` (`owner_id`);--> statement-breakpoint
CREATE INDEX `projects_visibility_idx` ON `projects` (`visibility`);--> statement-breakpoint
CREATE INDEX `projects_updated_idx` ON `projects` (`updated_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);