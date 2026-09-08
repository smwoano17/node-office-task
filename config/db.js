import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// CREATE TABLE `revoked_tokens` (
//  `id` int NOT NULL AUTO_INCREMENT,
//  `token` text NOT NULL,
//  `expires_at` datetime NOT NULL,
//  PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

// CREATE TABLE `users` (
//  `id` int NOT NULL AUTO_INCREMENT,
//  `name` varchar(100) NOT NULL,
//  `email` varchar(150) NOT NULL,
//  `password` varchar(255) NOT NULL,
//  `role` enum('user','admin') DEFAULT 'user',
//  `is_login` tinyint(1) NOT NULL DEFAULT '0',
//  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
//  PRIMARY KEY (`id`),
//  UNIQUE KEY `email` (`email`)
// ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;