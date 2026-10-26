-- Create `project_images` table
CREATE TABLE `project_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `path` VARCHAR(1024) NOT NULL,
    `alt` VARCHAR(255) NOT NULL DEFAULT '',
    `width` INTEGER UNSIGNED NOT NULL,
    `height` INTEGER UNSIGNED NOT NULL,
    `is_cover` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `project_images_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `project_images` ADD CONSTRAINT `project_images_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
