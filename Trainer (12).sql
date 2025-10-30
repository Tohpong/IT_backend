-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Oct 30, 2025 at 08:34 AM
-- Server version: 8.0.44
-- PHP Version: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Trainer`
--

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--

CREATE TABLE `Account` (
  `account_id` int NOT NULL,
  `account_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Account`
--

INSERT INTO `Account` (`account_id`, `account_pic`, `username`, `password`, `role`) VALUES
(1, NULL, 'Boxygen', 'Boxygen', ''),
(2, NULL, 'Teenoi', '123', ''),
(4, 'Boxyjung', 'Em', '123', ''),
(29, NULL, 'baimon07', '$2b$10$zrw5svdjee/9fP6Z4kT60eyYgnIDE/SHd446SLQzhFvcmNfWfxL0O', 'user'),
(30, NULL, 'Bank', '$2b$10$U1nrOUdFKEOS8gsbdMRRQuqQswC/HWVLsiXejhL0Wn0y8OeFtH1gu', 'user'),
(32, NULL, 'test1', '$2b$10$SVH1VsowDR1b.dxYoYK1xOaYW0var7JaokMGI.Z/UJaynV9eIzl6q', 'user'),
(33, NULL, 'test', '$2b$10$pvw0CT0xbs.2WI3KvxeuMOIpiIuZYJ0E5L9ThL3ZR6.gHk.6fsIvW', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `course_id` int NOT NULL,
  `course_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`course_id`, `course_name`, `img_url`, `description`, `price`, `level`, `tags`, `duration`, `account_id`) VALUES
(1, 'Basic Fitness Training', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'เริ่มต้นการออกกำลังกายอย่างถูกต้อง สร้างพื้นฐานที่แข็งแรงให้กับร่างกาย', 1500, 'เริ่มต้น', 'ฟิตเนส, เริ่มต้น, พื้นฐาน', '45', 1),
(2, 'Yoga & Flexibility', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'เพิ่มความยืดหยุ่นและความสมดุลของร่างกายด้วยท่าโยคะ', 2000, 'สูง', 'กล้ามเนื้อ, น้ำหนัก, ความแข็งแรง', '60', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Member`
--

CREATE TABLE `Member` (
  `member_id` int NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` int NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` datetime(3) DEFAULT NULL,
  `gender` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Member`
--

INSERT INTO `Member` (`member_id`, `full_name`, `email`, `age`, `phone`, `birthdate`, `gender`, `account_id`) VALUES
(1, 'Tohpong Kijjanulak', '', 22, '0646959634', '2003-09-09 00:00:00.000', 'male', 1),
(21, 'Orapriya Jakrapet', NULL, 0, '0812345678', '2003-06-10 00:00:00.000', 'female', 29),
(22, 'Sakda', NULL, 22, '0123456789', '2003-07-14 00:00:00.000', 'male', 30),
(23, 'tester kung', NULL, 0, '0646959633', '2025-10-10 00:00:00.000', 'male', 32),
(24, 'tester kung', NULL, 0, '12587466', '2025-10-30 00:00:00.000', 'male', 33);

-- --------------------------------------------------------

--
-- Table structure for table `Trainer`
--

CREATE TABLE `Trainer` (
  `trainer_id` int NOT NULL,
  `trainer_fullname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trainer_age` int DEFAULT NULL,
  `trainer_date` datetime(3) DEFAULT NULL,
  `account_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Trainer`
--

INSERT INTO `Trainer` (`trainer_id`, `trainer_fullname`, `trainer_age`, `trainer_date`, `account_id`) VALUES
(1, 'Teenoi Naja', 30, '2025-09-15 23:48:30.000', 2),
(2, 'Em Yoga', 32, '2025-09-01 06:00:00.000', 4);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('e27dec23-ef7b-49b4-b7a7-84c660328f20', '29311d05b24830b4a0b4180321b87c966816838c25886df72a4965e6f81e570c', '2025-09-19 15:52:34.740', '20250919155231_init', NULL, NULL, '2025-09-19 15:52:31.664', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `Course_account_id_fkey` (`account_id`);

--
-- Indexes for table `Member`
--
ALTER TABLE `Member`
  ADD PRIMARY KEY (`member_id`),
  ADD KEY `Member_account_id_fkey` (`account_id`);

--
-- Indexes for table `Trainer`
--
ALTER TABLE `Trainer`
  ADD PRIMARY KEY (`trainer_id`),
  ADD KEY `Trainer_account_id_fkey` (`account_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Account`
--
ALTER TABLE `Account`
  MODIFY `account_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `course_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Member`
--
ALTER TABLE `Member`
  MODIFY `member_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Trainer`
--
ALTER TABLE `Trainer`
  MODIFY `trainer_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Course`
--
ALTER TABLE `Course`
  ADD CONSTRAINT `Course_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `Member`
--
ALTER TABLE `Member`
  ADD CONSTRAINT `Member_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `Trainer`
--
ALTER TABLE `Trainer`
  ADD CONSTRAINT `Trainer_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
