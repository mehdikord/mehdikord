-- Create `profile_translations` table
CREATE TABLE `profile_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `profile_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `summary` TEXT NOT NULL,
    `bio` JSON NOT NULL,
    `availability_label` VARCHAR(255) NOT NULL,
    `hero_headline` JSON NOT NULL,
    `hero_description` TEXT NOT NULL,
    `primary_cta_label` VARCHAR(255) NOT NULL,
    `secondary_cta_label` VARCHAR(255) NOT NULL,
    `signature` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `profile_translations_profile_id_locale_key`(`profile_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `profile_translations` ADD CONSTRAINT `profile_translations_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
