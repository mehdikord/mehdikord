-- Optimized WebP renditions of each project screenshot (full length and a top-of-page poster).
ALTER TABLE `project_images` ADD COLUMN `variants` JSON NULL;
