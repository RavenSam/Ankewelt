PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_book` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`genre` text,
	`status` text DEFAULT 'active',
	`cover_url` text,
	`banner_url` text,
	`is_public` integer DEFAULT false NOT NULL,
	`word_count` integer DEFAULT 0 NOT NULL,
	`goal_words` integer DEFAULT 100000,
	`ungrouped_chapters_order` text DEFAULT '[]' NOT NULL,
	`chapters_groupes_order` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_book`("id", "user_id", "title", "description", "genre", "status", "cover_url", "banner_url", "is_public", "word_count", "goal_words", "ungrouped_chapters_order", "chapters_groupes_order", "created_at", "updated_at") SELECT "id", "user_id", "title", "description", "genre", "status", "cover_url", "banner_url", "is_public", "word_count", "goal_words", "ungrouped_chapters_order", "chapters_groupes_order", "created_at", "updated_at" FROM `book`;--> statement-breakpoint
DROP TABLE `book`;--> statement-breakpoint
ALTER TABLE `__new_book` RENAME TO `book`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `book_id_unique` ON `book` (`id`);--> statement-breakpoint
CREATE TABLE `__new_chapter_group` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`name` text NOT NULL,
	`collapsed` integer DEFAULT false NOT NULL,
	`chapters_order` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_chapter_group`("id", "book_id", "name", "collapsed", "chapters_order", "created_at", "updated_at") SELECT "id", "book_id", "name", "collapsed", "chapters_order", "created_at", "updated_at" FROM `chapter_group`;--> statement-breakpoint
DROP TABLE `chapter_group`;--> statement-breakpoint
ALTER TABLE `__new_chapter_group` RENAME TO `chapter_group`;--> statement-breakpoint
CREATE UNIQUE INDEX `chapter_group_id_unique` ON `chapter_group` (`id`);