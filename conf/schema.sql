DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
	`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	`title` VARCHAR(255),
	`author` VARCHAR(255),
	`markdown` TEXT,
	`html` TEXT
);
