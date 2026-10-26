-- Create `projects` table
CREATE TABLE `projects` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_category_id` BIGINT UNSIGNED NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `period` VARCHAR(64) NOT NULL,
    `technologies` JSON NOT NULL,
    `live_url` VARCHAR(1024) NOT NULL DEFAULT '',
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `case_study_available` BOOLEAN NOT NULL DEFAULT false,
    `preview_kind` VARCHAR(32) NOT NULL DEFAULT 'crm',
    `preview_accent` VARCHAR(32) NOT NULL DEFAULT 'violet',
    `preview_light` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_project_category_id_idx`(`project_category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `projects` ADD CONSTRAINT `projects_project_category_id_fkey` FOREIGN KEY (`project_category_id`) REFERENCES `project_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
