/*
  Warnings:

  - You are about to drop the column `truck_id` on the `trip` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `Transporter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `trip` DROP FOREIGN KEY `Trip_truck_id_fkey`;

-- DropIndex
DROP INDEX `Trip_truck_id_fkey` ON `trip`;

-- AlterTable
ALTER TABLE `location` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `transporter` ADD COLUMN `unit_price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `trip` DROP COLUMN `truck_id`;
