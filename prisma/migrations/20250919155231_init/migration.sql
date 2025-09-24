-- CreateTable
CREATE TABLE `Account` (
    `account_id` INTEGER NOT NULL,
    `account_pic` VARCHAR(255) NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `course_id` INTEGER NOT NULL,
    `course_name` VARCHAR(100) NULL,
    `img_url` VARCHAR(255) NULL,
    `date` DATETIME(3) NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `member_id` INTEGER NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` VARCHAR(100) NOT NULL,
    `birthdate` DATETIME(3) NULL,
    `gender` VARCHAR(100) NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trainer` (
    `trainer_id` INTEGER NOT NULL,
    `trainer_fullname` VARCHAR(100) NOT NULL,
    `trainer_age` INTEGER NULL,
    `trainer_date` DATETIME(3) NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`trainer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trainer` ADD CONSTRAINT `Trainer_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
