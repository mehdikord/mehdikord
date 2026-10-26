-- Drop the illustrative-preview columns from `projects`; projects without a
-- screenshot now show the default website image.
ALTER TABLE `projects` DROP COLUMN `preview_accent`,
    DROP COLUMN `preview_kind`,
    DROP COLUMN `preview_light`;
