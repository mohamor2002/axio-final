/*
  Warnings:

  - You are about to drop the column `strategy` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `z` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `trip` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unloadingTime` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `RequestProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategy` to the `Transporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actual_start_date` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predefined_end_date` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predefined_start_date` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contract` DROP COLUMN `strategy`;

-- AlterTable
ALTER TABLE `location` DROP COLUMN `x`,
    DROP COLUMN `y`,
    DROP COLUMN `z`,
    ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL,
    ADD COLUMN `unloadingTime` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `requestproduct` ADD COLUMN `location_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `transporter` ADD COLUMN `strategy` ENUM('WEIGHT', 'DISTANCE', 'RIDE') NOT NULL;

-- AlterTable
ALTER TABLE `trip` DROP COLUMN `start_date`,
    ADD COLUMN `actual_start_date` DATETIME(3) NOT NULL,
    ADD COLUMN `predefined_end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `predefined_start_date` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `RequestProduct` ADD CONSTRAINT `RequestProduct_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
