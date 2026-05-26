-- CreateTable
CREATE TABLE `ExaminationItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `refRange` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExaminationItem_departmentId_idx`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExaminationOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appointmentId` INTEGER NULL,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `clinicalDiag` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExaminationOrder_patientId_idx`(`patientId`),
    INDEX `ExaminationOrder_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExaminationOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `examinationItemId` INTEGER NOT NULL,
    `result` VARCHAR(191) NULL,
    `refRange` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ExaminationOrderItem_orderId_examinationItemId_key`(`orderId`, `examinationItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExaminationReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NULL,
    `images` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExaminationItem` ADD CONSTRAINT `ExaminationItem_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExaminationOrder` ADD CONSTRAINT `ExaminationOrder_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExaminationOrderItem` ADD CONSTRAINT `ExaminationOrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `ExaminationOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExaminationOrderItem` ADD CONSTRAINT `ExaminationOrderItem_examinationItemId_fkey` FOREIGN KEY (`examinationItemId`) REFERENCES `ExaminationItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExaminationReport` ADD CONSTRAINT `ExaminationReport_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `ExaminationOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
