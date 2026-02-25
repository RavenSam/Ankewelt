ALTER TABLE `book` ADD `ungrouped_chapters_order` blob DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `book` ADD `chapters_groupes_order` blob DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `chapter_group` ADD `chapters_order` blob DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `chapter_group` DROP COLUMN `position`;--> statement-breakpoint
ALTER TABLE `chapter` DROP COLUMN `position`;--> statement-breakpoint
ALTER TABLE `chapter` DROP COLUMN `root_position`;