-- CreateTable
CREATE TABLE `marketers` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NULL,
    `specialties` JSON NOT NULL,
    `portfolio` VARCHAR(191) NULL,
    `socialLinks` JSON NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalEarnings` DOUBLE NOT NULL DEFAULT 0,
    `completedTasks` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `stripeAccountId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `marketers_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_tasks` (
    `id` VARCHAR(191) NOT NULL,
    `sellerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `productDetails` VARCHAR(191) NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `requirements` VARCHAR(191) NOT NULL,
    `budget` DOUBLE NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `maxSubmissions` INTEGER NOT NULL DEFAULT 10,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `totalSubmissions` INTEGER NOT NULL DEFAULT 0,
    `approvedSubmissions` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `marketerId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `mediaUrls` JSON NOT NULL,
    `notes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `feedback` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payouts` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `marketerId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `stripePayoutId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payouts_submissionId_key`(`submissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sellers` ADD CONSTRAINT `sellers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marketers` ADD CONSTRAINT `marketers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reward_tasks` ADD CONSTRAINT `reward_tasks_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `sellers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_submissions` ADD CONSTRAINT `content_submissions_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `reward_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_submissions` ADD CONSTRAINT `content_submissions_marketerId_fkey` FOREIGN KEY (`marketerId`) REFERENCES `marketers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payouts` ADD CONSTRAINT `payouts_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `content_submissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payouts` ADD CONSTRAINT `payouts_marketerId_fkey` FOREIGN KEY (`marketerId`) REFERENCES `marketers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payouts` ADD CONSTRAINT `payouts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
