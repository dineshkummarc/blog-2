DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
	`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	`date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`title` VARCHAR(255) NOT NULL DEFAULT '',
	`markdown` TEXT NOT NULL DEFAULT '',
	`html` TEXT NOT NULL DEFAULT ''
);
