-- AlterTable
ALTER TABLE `Deployment` ADD COLUMN `detectedFeatures` VARCHAR(191) NULL,
    ADD COLUMN `intelligenceData` VARCHAR(191) NULL,
    ADD COLUMN `siteCategory` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Site` ADD COLUMN `detectedFeatures` VARCHAR(191) NULL,
    ADD COLUMN `heroLayout` VARCHAR(191) NULL,
    ADD COLUMN `industryConfidence` INTEGER NULL,
    ADD COLUMN `primaryColor` VARCHAR(191) NULL,
    ADD COLUMN `sectionCount` INTEGER NULL,
    ADD COLUMN `siteCategory` VARCHAR(191) NULL,
    MODIFY `template` VARCHAR(191) NOT NULL DEFAULT 'adaptive';
