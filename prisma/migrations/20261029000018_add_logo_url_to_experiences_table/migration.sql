-- Company logo for each experience entry, uploaded from the admin panel.
ALTER TABLE `experiences` ADD COLUMN `logo_url` VARCHAR(1024) NOT NULL DEFAULT '';
