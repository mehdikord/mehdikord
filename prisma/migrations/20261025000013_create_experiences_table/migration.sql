-- Create `experiences` table
CREATE TABLE `experiences` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `start_month` CHAR(7) NOT NULL,
    `end_month` CHAR(7) NULL,
    `technologies` JSON NOT NULL,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
