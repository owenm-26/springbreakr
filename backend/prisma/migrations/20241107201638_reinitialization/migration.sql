-- CreateTable
CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `macroLocation` VARCHAR(191) NOT NULL,
    `anonymousVoting` BOOLEAN NOT NULL DEFAULT false,
    `joinCode` INTEGER NULL,

    UNIQUE INDEX `Trip_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MicroLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `tripId` INTEGER NOT NULL,

    UNIQUE INDEX `MicroLocation_id_key`(`id`),
    INDEX `MicroLocation_tripId_fkey`(`tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Traveler` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Traveler_id_key`(`id`),
    INDEX `Traveler_tripId_fkey`(`tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Dislikers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Dislikers_AB_unique`(`A`, `B`),
    INDEX `_Dislikers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Likers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Likers_AB_unique`(`A`, `B`),
    INDEX `_Likers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MicroLocation` ADD CONSTRAINT `MicroLocation_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Traveler` ADD CONSTRAINT `Traveler_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Dislikers` ADD CONSTRAINT `_Dislikers_A_fkey` FOREIGN KEY (`A`) REFERENCES `MicroLocation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Dislikers` ADD CONSTRAINT `_Dislikers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Traveler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Likers` ADD CONSTRAINT `_Likers_A_fkey` FOREIGN KEY (`A`) REFERENCES `MicroLocation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Likers` ADD CONSTRAINT `_Likers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Traveler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
