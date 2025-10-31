-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Oct 31, 2025 at 10:20 PM
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
(2, NULL, 'Teenoi', '123', ''),
(4, 'Boxyjung', 'Em', '123', ''),
(29, NULL, 'baimon07', '$2b$10$zrw5svdjee/9fP6Z4kT60eyYgnIDE/SHd446SLQzhFvcmNfWfxL0O', 'user'),
(35, NULL, 'Boxygen2', '$2b$10$Wfa/rkIPbG0.eobUe7lQN.xr1ExO046GpnesBsIs36MiyLcSJ43iK', 'user'),
(36, NULL, 'Boxygen', '$2b$10$HYPjGNxxfPVQwtC1xmj/WO/u6dGdwu0qtMn4zNuD.QnsfF1xYu7l6', 'user'),
(37, NULL, 'Boxygen3', '$2b$10$fxkb1DMN1tA4WxsHltpVmeApTZXcYivwoLs9Xg9dn.a55xKrzHTUy', 'user'),
(38, NULL, 'Boxygen4', '$2b$10$3RnELaEcuMBWJczdIP0nKePNEBKUhZ8I2aEHQH5Sd56PJRCiXKPz.', 'user'),
(39, NULL, 'Not', '$2b$10$TmhokgRtDInipCo9Dnn3ie3aguAZ.qjbbzs8xkUqr3uGLDckpwKkO', 'user'),
(40, NULL, 'admin', '$2b$10$B.cw1bvmKdDxQhA4UnFo1uNWfidZ9jF9LphDZ/SG7vqmqkmoiYf3O', 'user'),
(41, NULL, '6521650858', '$2b$10$Ca4PynsHGBpYxLXZ5V0dKuPXoiU176dYMgjwD8GMRGv3IKPJmRr5.', 'user'),
(42, NULL, 'b6521650858', '$2b$10$gFgHbZPK22hHsQvOVwbJvuEzpiCkCdjEM6Wy5NZy6uw.IhOdDXpKG', 'user'),
(43, NULL, 'test01', '$2b$10$vSawfQQqyTUN5GeJORtT0uJ/C4t3Qs8V5wdyUdivOyev4T.NG1Bl2', 'user'),
(44, NULL, 'kruzomo', '123456', 'trainer'),
(45, NULL, 'kruzomo', '123456', 'trainer'),
(46, NULL, 'kruzomo', '123456', 'trainer'),
(47, NULL, 'kruzomo', '123456', 'trainer'),
(48, NULL, 'kruzomo', '123456', 'trainer'),
(49, NULL, 'kruzomo', '123456', 'trainer');

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
  `trainer_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`course_id`, `course_name`, `img_url`, `description`, `price`, `level`, `tags`, `duration`, `trainer_id`) VALUES
(2, 'Yoga & Flexibility', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'เพิ่มความยืดหยุ่นและความสมดุลของร่างกายด้วยท่าโยคะ', 2000, 'สูง', 'กล้ามเนื้อ, น้ำหนัก, ความแข็งแรง', '60 นาที', NULL),
(3, 'Basic Fitness Training', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'เริ่มต้นการออกกำลังกายอย่างถูกต้อง สร้างพื้นฐานที่แข็งแรงให้กับร่างกาย', 1500, 'เริ่มต้น', 'ฟิตเนส, เริ่มต้น, พื้นฐาน', '45 นาที', NULL),
(4, 'Cardio Workout', 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'เผาผลาญไขมันและเพิ่มความแข็งแรงของหัวใจด้วยการออกกำลังกายแบบแอโรบิก', 1200, 'กลาง', 'คาร์ดิโอ, เผาไขมัน, หัวใจ', '30 นาที', NULL),
(5, 'Strength Training', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'สร้างกล้ามเนื้อและเพิ่มความแข็งแรงด้วยเทคนิคการยกน้ำหนักที่ถูกต้อง', 2000, 'สูง', 'กล้ามเนื้อ, น้ำหนัก, ความแข็งแรง', '60 นาที', NULL),
(6, 'HIIT Training', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'การออกกำลังกายแบบ High Intensity สำหรับการเผาผลาญไขมันสูงสุด', 1800, 'สูง', 'HIIT, เข้มข้น, เผาไขมัน', '25 นาที', NULL),
(7, 'Functional Training', 'https://cdn.centr.com/content/26000/25412/images/landscapewidedesktop1x-ec41255412947b51796bd952c5bafe04-ic-what-is-functional-training-inline-6-169-16922.jpg', 'พัฒนาความแข็งแรงและการเคลื่อนไหวที่ใช้ในชีวิตประจำวัน', 1700, 'กลาง', 'ฟังก์ชัน, ชีวิตประจำวัน, การเคลื่อนไหว', '55 นาที', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Enrollment`
--

CREATE TABLE `Enrollment` (
  `enrollment_id` int NOT NULL,
  `member_id` int NOT NULL,
  `course_id` int NOT NULL,
  `enrollment_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `experience` varchar(255) DEFAULT NULL,
  `goal` varchar(255) DEFAULT NULL,
  `health` text,
  `payment_method` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Enrollment`
--

INSERT INTO `Enrollment` (`enrollment_id`, `member_id`, `course_id`, `enrollment_date`, `experience`, `goal`, `health`, `payment_method`, `price`, `status`) VALUES
(15, 27, 4, '2025-10-31 16:39:22.357', 'intermediate', '1234567890', '', 'promptpay', 1200, 'active'),
(19, 30, 3, '2025-10-31 17:41:26.907', 'beginner', '1234567890', '', 'promptpay', 1500, 'active'),
(20, 27, 5, '2025-10-31 18:56:27.057', 'intermediate', '1234567890-', '', 'promptpay', 2000, 'active');

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
(21, 'Orapriya Jakrapet', 'orapriya.ja@ku.th', 22, '0812345678', '2003-06-09 00:00:00.000', 'female', 29),
(26, 'Boxykung', 'boxygen@gmail.com', 0, '0646959634', '2003-09-09 00:00:00.000', 'male', 35),
(27, 'Tohpong Kijjanulak', 'boxygen@gmail.com', 22, '0646959634', '2003-09-06 00:00:00.000', 'male', 36),
(28, 'Boxykung', '', 0, '0646959634', '2003-09-09 00:00:00.000', 'male', 37),
(29, 'Boxykung', 'boxygen@gmail.com', 0, '0646959634', '2003-09-09 00:00:00.000', 'male', 38),
(30, 'pongamorn', 'pongamorn@gmail.com', 21, '0747474758', '2003-11-23 00:00:00.000', 'male', 39),
(31, 'Admin', 'admin@admin.com', 0, '0123456789', '2025-10-25 00:00:00.000', 'male', 40),
(32, 'Tohpong Kijjanulak', 'tohpong.k@ku.th', 22, '1111111111', '2003-09-09 00:00:00.000', 'male', 41),
(33, 'ต่อพงศ์ กิจจานุลักษ์', 'Sakda@gmail.com', 22, '0646959634', '2003-09-09 00:00:00.000', 'male', 42),
(34, 'test001', 'test01@gmail.com', 0, '0646959634', '2025-10-31 00:00:00.000', 'male', 43);

-- --------------------------------------------------------

--
-- Table structure for table `Trainer`
--

CREATE TABLE `Trainer` (
  `trainer_id` int NOT NULL,
  `trainer_fullname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trainer_age` int DEFAULT NULL,
  `trainer_date` datetime(3) DEFAULT NULL,
  `trainer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainer_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainer_year` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainer_bio` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainer_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` float NOT NULL,
  `account_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Trainer`
--

INSERT INTO `Trainer` (`trainer_id`, `trainer_fullname`, `trainer_age`, `trainer_date`, `trainer_email`, `trainer_phone`, `trainer_year`, `trainer_bio`, `trainer_url`, `schedule`, `rating`, `account_id`, `course_id`) VALUES
(1, 'Kru ZomO', 25, '2025-01-11 00:00:00.000', 'jane.doe@fitness.com', '02-234-5678', '3', 'Kru ZomO เป็นครูโยคะที่มีความเชี่ยวชาญในการสอนโยคะทุกระดับ จากผู้เริ่มต้นจนถึงระดับขั้นสูง มีความเชี่ยวชาญพิเศษในด้าน Vinyasa Flow และ Yin Yoga Kru ZomO เชื่อในพลังของโยคะที่สามารถเปลี่ยนแปลงชีวิตทั้งร่างกายและจิตใจ', 'https://bestkru-thumbs.s3-ap-southeast-1.amazonaws.com/97443', 'จันทร์-ศุกร์ 7:00-19:00 , เสาร์-อาทิตย์ 9:00-17:00', 4.9, 2, 2),
(2, 'Kru ae', 32, '2025-09-01 06:00:00.000', 'mike.johnson@fitness.com', '02-345-6789', '7', 'Kru ae เป็นผู้เชี่ยวชาญด้านการออกกำลังกายแบบคาร์ดิโอ มีประสบการณ์ในการสอน HIIT และ Spinning Kru ae เป็นนักกีฬาระดับแนวหน้าที่หันมาเป็นเทรนเนอร์ เพื่อแบ่งปันความรู้และประสบการณ์ให้กับผู้ที่ต้องการปรับปรุงสุขภาพ', 'https://bestkru-thumbs.s3-ap-southeast-1.amazonaws.com/203647', 'จันทร์-ศุกร์ 5:30-21:00 , เสาร์-อาทิตย์ 7:00-19:00', 4.7, 4, 4),
(3, 'Pranthep Roongpromma', 28, '2025-01-01 00:00:00.000', 'pranthep.r@gmail.com', '0123456789', '5', 'Pranthep Roongpromma เป็นเทรนเนอร์ด้านการยกน้ำหนักที่มีประสบการณ์กว่า 5 ปี เชี่ยวชาญในการสร้างกล้ามเนื้อและการเพิ่มความแข็งแรง มีความเชี่ยวชาญในการออกแบบโปรแกรมการออกกำลังกายที่เหมาะสมกับแต่ละคน Pranthep เริ่มต้นการทำงานในวงการฟิตเนสตั้งแต่ปี 2019 และได้รับการรับรองจากหลายสถาบันชั้นนำ', 'https://bestkru-thumbs.s3-ap-southeast-1.amazonaws.com/112772', 'จันทร์-ศุกร์ 6:00-20:00, เสาร์-อาทิตย์ 8:00-18:00', 4.8, 2, 3);

--
-- Triggers `Trainer`
--
DELIMITER $$
CREATE TRIGGER `create_account_before_insert` BEFORE INSERT ON `Trainer` FOR EACH ROW BEGIN
  -- ✅ สร้าง Account ใหม่อัตโนมัติเมื่อเพิ่ม Trainer
  INSERT INTO Account (username, password, role)
  VALUES (NEW.trainer_fullname, '123456', 'trainer');

  -- ✅ ผูก account_id ที่เพิ่งสร้างกลับมาที่ Trainer
  SET NEW.account_id = LAST_INSERT_ID();
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_auto_create_account` BEFORE INSERT ON `Trainer` FOR EACH ROW BEGIN
  DECLARE new_account_id INT;

  -- เพิ่มบัญชีใหม่ในตาราง Account
  INSERT INTO Account (account_name, account_email, account_password)
  VALUES (NEW.trainer_fullname, NEW.trainer_email, 'default123');

  -- ดึง account_id ล่าสุด
  SET new_account_id = LAST_INSERT_ID();

  -- กำหนดให้ Trainer ใช้ account_id ที่เพิ่งสร้าง
  SET NEW.account_id = new_account_id;
END
$$
DELIMITER ;

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
  ADD KEY `Course_trainer_id_fkey` (`trainer_id`);

--
-- Indexes for table `Enrollment`
--
ALTER TABLE `Enrollment`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `course_id` (`course_id`);

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
  ADD KEY `Trainer_account_id_fkey` (`account_id`),
  ADD KEY `fk_trainer_course` (`course_id`);

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
  MODIFY `account_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `course_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Enrollment`
--
ALTER TABLE `Enrollment`
  MODIFY `enrollment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `Member`
--
ALTER TABLE `Member`
  MODIFY `member_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `Trainer`
--
ALTER TABLE `Trainer`
  MODIFY `trainer_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Course`
--
ALTER TABLE `Course`
  ADD CONSTRAINT `Course_trainer_id_fkey` FOREIGN KEY (`trainer_id`) REFERENCES `Trainer` (`trainer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Enrollment`
--
ALTER TABLE `Enrollment`
  ADD CONSTRAINT `Enrollment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `Member` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Enrollment_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Member`
--
ALTER TABLE `Member`
  ADD CONSTRAINT `Member_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `Trainer`
--
ALTER TABLE `Trainer`
  ADD CONSTRAINT `fk_trainer_course` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Trainer_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
