-- Create `principle_translations` table
CREATE TABLE `principle_translations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `principle_id` BIGINT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `principle_translations_principle_id_locale_key`(`principle_id`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys
ALTER TABLE `principle_translations` ADD CONSTRAINT `principle_translations_principle_id_fkey` FOREIGN KEY (`principle_id`) REFERENCES `principles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
