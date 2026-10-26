-- Create `project_translations` table
CREATE TABLE `project_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `short_description` TEXT NOT NULL,
    `full_description` JSON NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `highlights` JSON NOT NULL,
    `responsibilities` JSON NOT NULL,
    `case_study_context` TEXT NULL,
    `case_study_challenges` JSON NULL,
    `case_study_decisions` JSON NULL,
    `case_study_implementation` JSON NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `project_translations_project_id_locale_key`(`project_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `project_translations` ADD CONSTRAINT `project_translations_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
