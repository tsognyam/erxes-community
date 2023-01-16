-- CreateTable
CREATE TABLE `Bank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(400) NOT NULL,
    `englishName` VARCHAR(400) NOT NULL,
    `gatewayCode` VARCHAR(400) NOT NULL,

    UNIQUE INDEX `Bank_code_key`(`code`),
    UNIQUE INDEX `Bank_gatewayCode_key`(`gatewayCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `amount` DECIMAL(30, 4) NOT NULL,
    `jrno` VARCHAR(191) NOT NULL DEFAULT '',
    `txnSign` VARCHAR(1) NOT NULL DEFAULT '',
    `currencyCode` VARCHAR(6) NOT NULL,
    `status` INTEGER NOT NULL,
    `orderId` INTEGER NULL,
    `description` VARCHAR(400) NOT NULL,
    `oldDescription` VARCHAR(400) NULL,
    `dater` DATE NOT NULL,
    `bankCode` VARCHAR(50) NULL,
    `recAccountNo` VARCHAR(36) NOT NULL DEFAULT '',
    `contAccountNo` VARCHAR(36) NOT NULL DEFAULT '',
    `accountNo` VARCHAR(36) NOT NULL,
    `accountName` VARCHAR(100) NOT NULL,
    `message` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,
    `walletId` INTEGER NULL,

    UNIQUE INDEX `BankTransaction_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `System` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `updateddate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedby` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exchange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `name2` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `opendate` DATETIME(3) NULL,
    `closedate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `txnid` INTEGER NOT NULL AUTO_INCREMENT,
    `ordertype` INTEGER NULL,
    `txntype` INTEGER NOT NULL,
    `walletId` INTEGER NULL,
    `orderno` VARCHAR(191) NULL,
    `stockcode` INTEGER NOT NULL,
    `txndate` DATETIME(3) NOT NULL,
    `originalCnt` INTEGER NOT NULL DEFAULT 0,
    `cnt` INTEGER NOT NULL,
    `price` DECIMAL(30, 4) NOT NULL,
    `originalPrice` DECIMAL(30, 4) NOT NULL DEFAULT 0,
    `fee` DECIMAL(30, 4) NOT NULL,
    `donedate` DATETIME(3) NULL,
    `donecnt` INTEGER NULL,
    `doneprice` DECIMAL(30, 4) NULL,
    `originalDonePrice` DECIMAL(30, 4) NULL DEFAULT 0,
    `startdate` DATETIME(3) NULL,
    `enddate` DATETIME(3) NULL,
    `descr` VARCHAR(191) NULL,
    `descr2` VARCHAR(191) NULL,
    `txnsource` INTEGER NULL,
    `condid` INTEGER NULL,
    `userId` VARCHAR(191) NOT NULL,
    `brchno` VARCHAR(191) NULL,
    `regdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL,
    `updatedate` DATETIME(3) NULL,
    `updateUserId` VARCHAR(191) NULL,
    `ostatus` INTEGER NOT NULL DEFAULT 1,
    `oupdatedate` DATETIME(3) NULL,
    `oupdateUserId` VARCHAR(191) NULL,
    `tradecode` VARCHAR(191) NULL,
    `yield` INTEGER NULL,
    `msgid` INTEGER NULL,
    `ipo` INTEGER NULL,
    `ipaddress` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `mseExecutionId` VARCHAR(191) NULL,
    `mseOrderId` VARCHAR(191) NULL,
    `tranOrderId` INTEGER NULL,
    `stockOrderId` INTEGER NULL,
    `andIpoOrderId` VARCHAR(191) NULL,
    `settlementMSCCId` INTEGER NULL,

    PRIMARY KEY (`txnid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stocktype` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `name2` VARCHAR(191) NOT NULL,
    `listorder` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `feevalue` DECIMAL(30, 4) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Custfee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `stocktypeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `name2` VARCHAR(191) NULL,
    `descr` VARCHAR(191) NULL,
    `value` DECIMAL(30, 4) NOT NULL,
    `sidetype` INTEGER NULL,
    `updateddate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedby` INTEGER NULL,
    `status` INTEGER NOT NULL,

    INDEX `Custfee_stocktypeId_fkey`(`stocktypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockFav` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockcode` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `regdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockcode` INTEGER NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `stocktypeId` INTEGER NOT NULL,
    `stockname` VARCHAR(191) NULL,
    `stockprice` DECIMAL(30, 4) NOT NULL,
    `minprice` DECIMAL(30, 4) NULL DEFAULT 0,
    `maxprice` DECIMAL(30, 4) NULL DEFAULT 0,
    `openprice` DECIMAL(30, 4) NULL DEFAULT 0,
    `closeprice` DECIMAL(30, 4) NULL DEFAULT 0,
    `startdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enddate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `intrate` DECIMAL(30, 4) NULL DEFAULT 0,
    `userId` VARCHAR(191) NULL,
    `brchno` VARCHAR(191) NULL,
    `regdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT '1',
    `no` VARCHAR(191) NULL,
    `cnt` DECIMAL(30, 0) NULL,
    `boardname` VARCHAR(191) NULL,
    `inducode` VARCHAR(191) NULL,
    `lsttxndate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ipo` INTEGER NOT NULL,
    `intrate2` DECIMAL(30, 4) NULL,
    `externalid` VARCHAR(191) NULL,
    `paytype` VARCHAR(191) NULL,
    `multiplier` INTEGER NULL,
    `externalid2` VARCHAR(191) NULL,
    `order_begindate` DATETIME(3) NULL,
    `order_enddate` DATETIME(3) NULL,
    `notiftype` INTEGER NULL,
    `stockfee` DECIMAL(30, 4) NULL DEFAULT 0,
    `exchangeid` INTEGER NOT NULL,
    `ipotype` INTEGER NULL,
    `ipoexecution` DECIMAL(30, 4) NULL DEFAULT 0,
    `url` VARCHAR(100) NULL,
    `image` VARCHAR(500) NULL,
    `currencyCode` VARCHAR(6) NOT NULL DEFAULT 'MNT',

    UNIQUE INDEX `Stock_stockcode_key`(`stockcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currencyCode` VARCHAR(6) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `type` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,
    `walletNumber` VARCHAR(191) NOT NULL,
    `walletNumberId` INTEGER NULL,

    UNIQUE INDEX `Wallet_walletNumber_key`(`walletNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletNumber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `WalletNumber_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletId` INTEGER NOT NULL,
    `balance` DECIMAL(30, 4) NOT NULL,
    `holdBalance` DECIMAL(30, 4) NOT NULL,
    `tradeBalance` DECIMAL(30, 4) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `WalletBalance_walletId_key`(`walletId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockCode` INTEGER NOT NULL,
    `walletId` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `holdBalance` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockOrderId` INTEGER NOT NULL,
    `walletId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `dater` DATE NOT NULL,
    `stockCode` INTEGER NOT NULL,
    `stockCount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletIdFrom` INTEGER NULL,
    `walletIdTo` INTEGER NULL,
    `status` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `dater` DATE NOT NULL,
    `stockCount` INTEGER NOT NULL,
    `stockCode` INTEGER NOT NULL,
    `parentOrderId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Withdraw` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletId` INTEGER NOT NULL,
    `amount` DECIMAL(30, 4) NOT NULL,
    `status` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `feeAmount` DECIMAL(30, 4) NULL,
    `bankTransactionId` INTEGER NULL,
    `description` VARCHAR(400) NOT NULL,
    `dater` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,
    `userBankAccountId` INTEGER NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `Withdraw_bankTransactionId_key`(`bankTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `walletId` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `description` VARCHAR(400) NOT NULL DEFAULT '',
    `amount` DECIMAL(30, 4) NOT NULL,
    `beforeBalance` DECIMAL(30, 4) NOT NULL,
    `afterBalance` DECIMAL(30, 4) NOT NULL,
    `dater` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletIdFrom` INTEGER NULL,
    `walletIdTo` INTEGER NULL,
    `type` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `amount` DECIMAL(30, 4) NOT NULL,
    `feeAmount` DECIMAL(30, 4) NULL,
    `parentOrderId` INTEGER NULL,
    `dater` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settlement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletId` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `totalOutAmount` DECIMAL(30, 4) NOT NULL,
    `totalInAmount` DECIMAL(30, 4) NOT NULL,
    `totalFeeAmount` DECIMAL(30, 4) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettlementMSCC` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `tradeDate` DATETIME(3) NOT NULL,
    `settlementDate` DATETIME(3) NOT NULL,
    `cmId` VARCHAR(100) NOT NULL,
    `participantId` VARCHAR(10) NOT NULL,
    `participantType` VARCHAR(10) NOT NULL,
    `clientPrefix` VARCHAR(150) NOT NULL,
    `clientSuffix` VARCHAR(10) NOT NULL,
    `custodianID` VARCHAR(191) NULL,
    `securityMCategory` VARCHAR(10) NULL,
    `securityCategory` VARCHAR(10) NULL,
    `issuerCode` VARCHAR(10) NULL,
    `debtType` VARCHAR(10) NULL,
    `securityDesc` VARCHAR(100) NULL,
    `mainType` VARCHAR(10) NULL,
    `subType` VARCHAR(10) NULL,
    `buyQuantity` INTEGER NOT NULL,
    `buyObligation` DECIMAL(30, 4) NOT NULL,
    `sellQuantity` INTEGER NOT NULL,
    `sellObligation` DECIMAL(30, 4) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `obligation` DECIMAL(30, 4) NOT NULL,
    `minMargin` DECIMAL(30, 4) NOT NULL,
    `mseFee` DECIMAL(30, 4) NOT NULL,
    `msccFee` DECIMAL(30, 4) NOT NULL,
    `frcFee` DECIMAL(30, 4) NOT NULL,
    `currency` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL,
    `statusDescription` VARCHAR(500) NULL,
    `executedDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionMCSD` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `additional` TEXT NULL,
    `bdcId` INTEGER NOT NULL,
    `commission` DECIMAL(30, 4) NOT NULL,
    `description` VARCHAR(191) NULL,
    `mitPrefix` VARCHAR(191) NULL,
    `perPrice` DECIMAL(30, 4) NOT NULL,
    `securitiesCode` VARCHAR(191) NOT NULL,
    `securitiesName` VARCHAR(191) NOT NULL,
    `securitiesQuantity` DECIMAL(30, 4) NOT NULL,
    `tradeId` INTEGER NOT NULL,
    `transactionDate` DATETIME(3) NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `transactionTypeId` INTEGER NOT NULL,
    `transactionTypeName` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMCSDAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(191) NULL,
    `clientSuffix` VARCHAR(191) NULL,
    `fullPrefix` VARCHAR(191) NULL,
    `bdcAccountId` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `description` VARCHAR(400) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `UserMCSDAccount_userId_key`(`userId`),
    UNIQUE INDEX `prefix`(`prefix`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBankAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `bankCode` VARCHAR(191) NOT NULL,
    `accountNo` VARCHAR(36) NOT NULL,
    `accountName` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdUserId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NULL,
    `updatedUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `UserBankAccount_userId_key`(`userId`),
    INDEX `accout_no_ix`(`accountNo`),
    INDEX `id_ix`(`id`),
    INDEX `user_id_ix`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Calendar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `fullDate` DATETIME(3) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdUserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `TransactionOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_stockcode_fkey` FOREIGN KEY (`stockcode`) REFERENCES `Stock`(`stockcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_settlementMSCCId_fkey` FOREIGN KEY (`settlementMSCCId`) REFERENCES `SettlementMSCC`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_tranOrderId_fkey` FOREIGN KEY (`tranOrderId`) REFERENCES `TransactionOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_stockOrderId_fkey` FOREIGN KEY (`stockOrderId`) REFERENCES `StockOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserMCSDAccount`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Custfee` ADD CONSTRAINT `Custfee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserMCSDAccount`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockFav` ADD CONSTRAINT `StockFav_stockcode_fkey` FOREIGN KEY (`stockcode`) REFERENCES `Stock`(`stockcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_exchangeid_fkey` FOREIGN KEY (`exchangeid`) REFERENCES `Exchange`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserMCSDAccount`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_walletNumber_fkey` FOREIGN KEY (`walletNumber`) REFERENCES `WalletNumber`(`number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletBalance` ADD CONSTRAINT `WalletBalance_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockBalance` ADD CONSTRAINT `StockBalance_stockCode_fkey` FOREIGN KEY (`stockCode`) REFERENCES `Stock`(`stockcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockBalance` ADD CONSTRAINT `StockBalance_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransaction` ADD CONSTRAINT `StockTransaction_stockOrderId_fkey` FOREIGN KEY (`stockOrderId`) REFERENCES `StockOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransaction` ADD CONSTRAINT `StockTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransaction` ADD CONSTRAINT `StockTransaction_stockCode_fkey` FOREIGN KEY (`stockCode`) REFERENCES `Stock`(`stockcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOrder` ADD CONSTRAINT `StockOrder_walletIdFrom_fkey` FOREIGN KEY (`walletIdFrom`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOrder` ADD CONSTRAINT `StockOrder_walletIdTo_fkey` FOREIGN KEY (`walletIdTo`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOrder` ADD CONSTRAINT `StockOrder_stockCode_fkey` FOREIGN KEY (`stockCode`) REFERENCES `Stock`(`stockcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOrder` ADD CONSTRAINT `StockOrder_parentOrderId_fkey` FOREIGN KEY (`parentOrderId`) REFERENCES `StockOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `Withdraw_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `Withdraw_bankTransactionId_fkey` FOREIGN KEY (`bankTransactionId`) REFERENCES `BankTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `Withdraw_userBankAccountId_fkey` FOREIGN KEY (`userBankAccountId`) REFERENCES `UserBankAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `Withdraw_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserMCSDAccount`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `TransactionOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionOrder` ADD CONSTRAINT `TransactionOrder_walletIdFrom_fkey` FOREIGN KEY (`walletIdFrom`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionOrder` ADD CONSTRAINT `TransactionOrder_walletIdTo_fkey` FOREIGN KEY (`walletIdTo`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionOrder` ADD CONSTRAINT `TransactionOrder_parentOrderId_fkey` FOREIGN KEY (`parentOrderId`) REFERENCES `TransactionOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementMSCC` ADD CONSTRAINT `SettlementMSCC_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserMCSDAccount`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBankAccount` ADD CONSTRAINT `UserBankAccount_bankCode_fkey` FOREIGN KEY (`bankCode`) REFERENCES `Bank`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
