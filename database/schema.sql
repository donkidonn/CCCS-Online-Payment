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

-- Create payment table
CREATE TABLE IF NOT EXISTS payment (
  payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paypal_reference VARCHAR(255) NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id),
  INDEX idx_paid_at (paid_at)
);

-- Add account_balance to accounts table if not exists
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_balance DECIMAL(10, 2) DEFAULT 0.00;
