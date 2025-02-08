/*
  Warnings:

  - The primary key for the `productloadplan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `load_id` on the `productloadplan` table. All the data in the column will be lost.
  - You are about to drop the `loadplan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategy` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_id` to the `ProductLoadPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truck_id` to the `ProductLoadPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `loadplan` DROP FOREIGN KEY `LoadPlan_trip_id_fkey`;

-- DropForeignKey
ALTER TABLE `loadplan` DROP FOREIGN KEY `LoadPlan_truck_id_fkey`;

-- AlterTable
ALTER TABLE `contract` ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `strategy` ENUM('WEIGHT', 'DISTANCE', 'RIDE') NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `type` ENUM('FRAGILE', 'DANGEROUS', 'NORMAL') NOT NULL;

-- AlterTable
ALTER TABLE `productloadplan` DROP PRIMARY KEY,
    DROP COLUMN `load_id`,
    ADD COLUMN `trip_id` INTEGER NOT NULL,
    ADD COLUMN `truck_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`trip_id`, `truck_id`, `product_id`);

-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `start_date` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `loadplan`;

-- AddForeignKey
ALTER TABLE `ProductLoadPlan` ADD CONSTRAINT `ProductLoadPlan_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductLoadPlan` ADD CONSTRAINT `ProductLoadPlan_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductLoadPlan` ADD CONSTRAINT `ProductLoadPlan_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
