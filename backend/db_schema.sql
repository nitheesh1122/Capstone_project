CREATE DATABASE IF NOT EXISTS restaurant_db_v2;
USE restaurant_db_v2;

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
    table_type VARCHAR(50) NOT NULL DEFAULT 'Regular',
    status ENUM('Available', 'Reserved', 'Occupied') NOT NULL DEFAULT 'Available',
    current_customer_id INT NULL,
    reservation_time DATETIME NULL,
    FOREIGN KEY (current_customer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    table_id INT,
    items JSON NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Received', 'Preparing', 'Ready', 'Served', 'Paid') DEFAULT 'Received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);
