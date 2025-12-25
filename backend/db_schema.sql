CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Manager', 'Admin') NOT NULL DEFAULT 'Customer',
    contact_info VARCHAR(255),
    queue_joined_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    type ENUM('Regular', 'VIP') NOT NULL DEFAULT 'Regular',
    status ENUM('Available', 'Reserved', 'Occupied') NOT NULL DEFAULT 'Available',
    current_customer_id INT NULL,
    reservation_time DATETIME NULL,
    FOREIGN KEY (current_customer_id) REFERENCES users(id) ON DELETE SET NULL
);
