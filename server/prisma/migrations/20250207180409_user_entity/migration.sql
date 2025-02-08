/*
  Warnings:

  - Added the required column `truck_id` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `trip` ADD COLUMN `truck_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
