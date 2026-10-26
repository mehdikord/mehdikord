-- Create `profiles` table
CREATE TABLE `profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `initials` VARCHAR(8) NOT NULL,
    `years_of_experience` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `email` VARCHAR(255) NOT NULL DEFAULT '',
    `phone` VARCHAR(32) NOT NULL DEFAULT '',
    `telegram` VARCHAR(255) NOT NULL DEFAULT '',
    `linkedin` VARCHAR(255) NOT NULL DEFAULT '',
    `instagram` VARCHAR(255) NOT NULL DEFAULT '',
    `hero_video_url` VARCHAR(1024) NOT NULL DEFAULT '',
    `hero_poster_url` VARCHAR(1024) NOT NULL DEFAULT '',
    `primary_cta_href` VARCHAR(255) NOT NULL DEFAULT '#work',
    `secondary_cta_href` VARCHAR(255) NOT NULL DEFAULT '#contact',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
