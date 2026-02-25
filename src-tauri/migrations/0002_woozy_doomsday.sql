PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chapter` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`group_id` text,
	`position` integer NOT NULL,
	`root_position` integer,
	`title` text NOT NULL,
	`chapter_number` integer NOT NULL,
	`status` text DEFAULT 'draft',
	`current_version_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `chapter_group`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_chapter`("id", "book_id", "group_id", "position", "root_position", "title", "chapter_number", "status", "current_version_id", "created_at", "updated_at") SELECT "id", "book_id", "group_id", "position", "root_position", "title", "chapter_number", "status", "current_version_id", "created_at", "updated_at" FROM `chapter`;--> statement-breakpoint
DROP TABLE `chapter`;--> statement-breakpoint
ALTER TABLE `__new_chapter` RENAME TO `chapter`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `chapter_id_unique` ON `chapter` (`id`);