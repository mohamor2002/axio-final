-- CreateTable
CREATE TABLE `Shipper` (
    `shipper_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`shipper_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transporter` (
    `transporter_id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`transporter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `driver_id` INTEGER NOT NULL AUTO_INCREMENT,
    `transporter_id` INTEGER NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `truck_id` INTEGER NOT NULL,

    UNIQUE INDEX `Driver_truck_id_key`(`truck_id`),
    PRIMARY KEY (`driver_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Truck` (
    `truck_id` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(191) NOT NULL,
    `height` DOUBLE NOT NULL,
    `width` DOUBLE NOT NULL,
    `length` DOUBLE NOT NULL,
    `max_weight` DOUBLE NOT NULL,
    `transporter_id` INTEGER NOT NULL,

    PRIMARY KEY (`truck_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contract` (
    `contract_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipper_id` INTEGER NOT NULL,
    `transporter_id` INTEGER NOT NULL,
    `driver_id` INTEGER NOT NULL,
    `truck_id` INTEGER NOT NULL,

    UNIQUE INDEX `Contract_driver_id_key`(`driver_id`),
    UNIQUE INDEX `Contract_truck_id_key`(`truck_id`),
    PRIMARY KEY (`contract_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipper_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `width` DOUBLE NOT NULL,
    `length` DOUBLE NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestProduct` (
    `request_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`request_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipper_id` INTEGER NOT NULL,

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `trip_id` INTEGER NOT NULL AUTO_INCREMENT,
    `contract_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`trip_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offer` (
    `offer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `duration` INTEGER NOT NULL,

    PRIMARY KEY (`offer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `shipper_id` INTEGER NOT NULL,
    `offer_id` INTEGER NOT NULL,

    PRIMARY KEY (`shipper_id`, `offer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoadPlan` (
    `load_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `truck_id` INTEGER NOT NULL,

    PRIMARY KEY (`load_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoutePlan` (
    `route_plan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `truck_id` INTEGER NOT NULL,

    PRIMARY KEY (`route_plan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `route_plan_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `z` DOUBLE NOT NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductLoadPlan` (
    `load_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `z` DOUBLE NOT NULL,

    PRIMARY KEY (`load_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_transporter_id_fkey` FOREIGN KEY (`transporter_id`) REFERENCES `Transporter`(`transporter_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Truck` ADD CONSTRAINT `Truck_transporter_id_fkey` FOREIGN KEY (`transporter_id`) REFERENCES `Transporter`(`transporter_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`driver_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_shipper_id_fkey` FOREIGN KEY (`shipper_id`) REFERENCES `Shipper`(`shipper_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestProduct` ADD CONSTRAINT `RequestProduct_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestProduct` ADD CONSTRAINT `RequestProduct_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `Request`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_shipper_id_fkey` FOREIGN KEY (`shipper_id`) REFERENCES `Shipper`(`shipper_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_contract_id_fkey` FOREIGN KEY (`contract_id`) REFERENCES `Contract`(`contract_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_shipper_id_fkey` FOREIGN KEY (`shipper_id`) REFERENCES `Shipper`(`shipper_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`offer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoadPlan` ADD CONSTRAINT `LoadPlan_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoadPlan` ADD CONSTRAINT `LoadPlan_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutePlan` ADD CONSTRAINT `RoutePlan_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `Trip`(`trip_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutePlan` ADD CONSTRAINT `RoutePlan_truck_id_fkey` FOREIGN KEY (`truck_id`) REFERENCES `Truck`(`truck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_route_plan_id_fkey` FOREIGN KEY (`route_plan_id`) REFERENCES `RoutePlan`(`route_plan_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
