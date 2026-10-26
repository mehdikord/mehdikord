-- Create `project_category_translations` table
CREATE TABLE `project_category_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_category_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `project_category_translations_project_category_id_locale_key`(`project_category_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `project_category_translations` ADD CONSTRAINT `project_category_translations_project_category_id_fkey` FOREIGN KEY (`project_category_id`) REFERENCES `project_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
