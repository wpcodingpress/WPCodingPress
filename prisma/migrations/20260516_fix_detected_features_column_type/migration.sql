-- AlterTable: Site.detectedFeatures VARCHAR(191) -> TEXT
-- The JSON-encoded feature data often exceeds 191 characters
ALTER TABLE `Site` MODIFY `detectedFeatures` TEXT NULL;

-- AlterTable: Deployment.detectedFeatures VARCHAR(191) -> TEXT
ALTER TABLE `Deployment` MODIFY `detectedFeatures` TEXT NULL;

-- AlterTable: Deployment.intelligenceData VARCHAR(191) -> LONGTEXT
-- The full intelligence analysis JSON blob can be very large
ALTER TABLE `Deployment` MODIFY `intelligenceData` LONGTEXT NULL;
