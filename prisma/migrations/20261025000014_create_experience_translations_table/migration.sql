-- Create `experience_translations` table
CREATE TABLE `experience_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `experience_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `company_context` VARCHAR(255) NOT NULL DEFAULT '',
    `position` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL,
    `responsibilities` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `experience_translations_experience_id_locale_key`(`experience_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `experience_translations` ADD CONSTRAINT `experience_translations_experience_id_fkey` FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
