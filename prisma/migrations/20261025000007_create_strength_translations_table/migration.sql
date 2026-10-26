-- Create `strength_translations` table
CREATE TABLE `strength_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `strength_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `strength_translations_strength_id_locale_key`(`strength_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `strength_translations` ADD CONSTRAINT `strength_translations_strength_id_fkey` FOREIGN KEY (`strength_id`) REFERENCES `strengths`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
