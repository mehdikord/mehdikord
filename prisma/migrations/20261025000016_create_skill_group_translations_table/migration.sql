-- Create `skill_group_translations` table
CREATE TABLE `skill_group_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `skill_group_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `annotation` VARCHAR(255) NOT NULL DEFAULT '',
    `items` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `skill_group_translations_skill_group_id_locale_key`(`skill_group_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `skill_group_translations` ADD CONSTRAINT `skill_group_translations_skill_group_id_fkey` FOREIGN KEY (`skill_group_id`) REFERENCES `skill_groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
