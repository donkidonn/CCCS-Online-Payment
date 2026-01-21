-- CCCS Online Payment System Database Schema
-- MySQL Database

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  First_name VARCHAR(100) NOT NULL,
  Last_name VARCHAR(100) NOT NULL,
  LRN VARCHAR(50) UNIQUE NOT NULL,
  Grade_level VARCHAR(20) NOT NULL,
  Section VARCHAR(50) NOT NULL,
  Email VARCHAR(255) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  Is_validated BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (Email),
  INDEX idx_lrn (LRN),
  INDEX idx_role (role)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
