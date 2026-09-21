-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 20, 2026 at 08:01 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `office_task`
--

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `front_route` varchar(50) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `parent_id`, `name`, `title`, `icon`, `route`, `front_route`, `sort_order`, `is_active`) VALUES
(1, NULL, 'dashboard', 'Dashboard', 'bi bi-grid-fill', '/api/dashboard', '/dashboard', 1, 1),
(2, NULL, 'account', 'Accounts', 'bi bi-person', NULL, NULL, 2, 1),
(3, 2, 'users', 'Users', NULL, '/api/users', '/users', 3, 1),
(4, 3, 'add_user', 'Add', NULL, '/api/users/store', NULL, 0, 0),
(5, 3, 'edit_user', 'Edit', NULL, '/api/users/update', NULL, 0, 0),
(6, 3, 'delete_user', 'Delete', NULL, '/api/users/delete', NULL, 0, 0),
(7, 3, 'view_user', 'View', NULL, '/users/show', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `menu_permissions`
--

CREATE TABLE `menu_permissions` (
  `menu_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `menu_permissions`
--

INSERT INTO `menu_permissions` (`menu_id`, `permission_id`) VALUES
(1, 1),
(3, 2),
(4, 3),
(5, 4),
(6, 5),
(7, 7);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'dashboard.view', 'View dashboard'),
(2, 'user.list', 'List User'),
(3, 'user.add', 'Add User'),
(4, 'user.edit', 'Edit User'),
(5, 'user.delete', 'Delete user'),
(7, 'user.view', 'View User');

-- --------------------------------------------------------

--
-- Table structure for table `revoked_tokens`
--

CREATE TABLE `revoked_tokens` (
  `id` int NOT NULL,
  `token` text NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `revoked_tokens`
--

INSERT INTO `revoked_tokens` (`id`, `token`, `expires_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODUxMjE3MiwiZXhwIjoxNzg4NTk4NTcyfQ.GHQstlDLp9gE2zrtT9yh3S453e_cTE4-CkbWVegU9dc', '2026-09-05 14:26:12'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODY1NjMwNywiZXhwIjoxNzg4NzQyNzA3fQ.YAcBSEd4m1ps5_1wnjZ248hDuncUsg8LCNHd8qblfds', '2026-09-07 06:28:27'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODY4Nzk1MywiZXhwIjoxNzg4Nzc0MzUzfQ.BzCDLMj1uELjRJ9YTWsd5XkmeLkAmjvAJNLZPCHG8fc', '2026-09-07 15:15:53'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlNvbmFsaSBNYWp1bWRhciIsImVtYWlsIjoic29uYWxpZGV5MjMwMUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODc1MjczMCwiZXhwIjoxNzg4ODM5MTMwfQ.avODlrjMFTLXjtC9xygh5yj_XwN4UHSKwTa5RFIwCk8', '2026-09-08 09:15:30'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODc1MjU3NywiZXhwIjoxNzg4ODM4OTc3fQ.0bW6d42tvVvB7Zd_wOv4uZqPzlMZvih5gwh3X7rx4R8', '2026-09-08 09:12:57'),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODc2OTc1NiwiZXhwIjoxNzg4ODU2MTU2fQ.ET0JlZoZCJc3AE0mojYn-Gu9c8aMquZMGuv_0_WG0sg', '2026-09-08 13:59:16'),
(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4ODc3Mjc3NCwiZXhwIjoxNzg4ODU5MTc0fQ.XyrcoDCrpQCFepCLam1kUwnKM0BWQ0h7BXOwXKoyWZg', '2026-09-08 14:49:34'),
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTI1OTcwNiwiZXhwIjoxNzg5MzQ2MTA2fQ.TFBOcY_8ZTRk73xdE598eyNnQkBsLOc26isbyW16YtA', '2026-09-14 06:05:06'),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTI4NTIyNywiZXhwIjoxNzg5MzcxNjI3fQ.SKt4jWw5xBMMFXAl3lLIi25gBujmYT6RPzg7NLRNSdA', '2026-09-14 13:10:27'),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTM1MjMxMSwiZXhwIjoxNzg5NDM4NzExfQ.dz7qcDRBHdKcfeCJBA19yruIlS5qVnOevrfPHjLXTvQ', '2026-09-15 07:48:31'),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTM2NDYyNywiZXhwIjoxNzg5NDUxMDI3fQ.8j-71JUeWytWn5TmQ03Nut3Yf1kVzLFeBjCfGm90q9Y', '2026-09-15 11:13:47'),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTYwMjgzOCwiZXhwIjoxNzg5Njg5MjM4fQ.inNqEvBC4y3f5QE-BO_CWtIv9Y9PcH9rTq2s8E5EiRE', '2026-09-18 05:23:58'),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTYxNDQ4NiwiZXhwIjoxNzg5NzAwODg2fQ.H6F3cwJQEYRaN0EdaKQZewnMVxdE0dDX_FN9jgiRAYY', '2026-09-18 08:38:06'),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTYzMjIzMywiZXhwIjoxNzg5NzE4NjMzfQ.bJHWgGPBgGuWxiLGveAZ_H4yEmBPPVxFIEnU32xcPE0', '2026-09-18 13:33:53'),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTc3NzI5OSwiZXhwIjoxNzg5ODYzNjk5fQ.RNT2W09_zY30It_fg2hh-S2Adi8MUi0Dm4L0NZcwUSQ', '2026-09-20 05:51:39'),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlNvbmFsaSBNYWp1bWRhciIsImVtYWlsIjoic29uYWxpZGV5MjMwMUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTc3ODIyNCwiZXhwIjoxNzg5ODY0NjI0fQ.1LPgcFNgMxBOTiYPCQPgkiF40JMeUyLsLOI47et4_XU', '2026-09-20 06:07:04'),
(17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1YmhhZGVlcCBNYWp1bWRhciIsImVtYWlsIjoic213b2Fub0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4OTgyMDU1MywiZXhwIjoxNzg5OTA2OTUzfQ.dN8_gxTMHzenAC6prWxfO8ohFNW-GyXAR3lk71x1ATs', '2026-09-20 17:52:33');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES
(1, 'Admin', '2026-09-10 04:28:15'),
(2, 'User', '2026-09-10 04:28:47');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(2, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `role_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_login` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `password`, `role`, `is_login`, `created_at`) VALUES
(1, 1, 'Subhadeep Majumdar', 'smwoano@gmail.com', '$2b$10$FRYxvUk8J87dL60hpygDF.qnpS7oV1V83UxS6wgKH5FtEbCI.DtzO', 'user', 0, '2026-09-03 13:20:45'),
(2, 2, 'Sonali Majumdar', 'sonalidey2301@gmail.com', '$2b$10$FRYxvUk8J87dL60hpygDF.qnpS7oV1V83UxS6wgKH5FtEbCI.DtzO', 'user', 0, '2026-09-05 09:38:32'),
(3, 2, 'Subho 2', 'suvo17m@gmail.com', '$2b$10$OAJV55q7jrUtvUkjC28.PuTbsP5reju3jdORYURvmRFVPhqPjuzFq', 'user', 0, '2026-09-14 06:27:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_menu_parent` (`parent_id`);

--
-- Indexes for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD PRIMARY KEY (`menu_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `revoked_tokens`
--
ALTER TABLE `revoked_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_role_id_user` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `revoked_tokens`
--
ALTER TABLE `revoked_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `fk_menu_parent` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_permissions`
--
ALTER TABLE `menu_permissions`
  ADD CONSTRAINT `menu_permissions_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_role_id_user` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
