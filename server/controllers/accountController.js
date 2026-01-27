const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Register new account
const register = async (req, res) => {
  try {
    const { First_name, Last_name, LRN, Grade_level, Section, Email, Password } = req.body;

    // Validation
    if (!First_name || !Last_name || !LRN || !Grade_level || !Section || !Email || !Password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.query(
      'SELECT id FROM accounts WHERE Email = ?',
      [Email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Check if LRN already exists
    const [existingLRN] = await db.query(
      'SELECT id FROM accounts WHERE LRN = ?',
      [LRN]
    );

    if (existingLRN.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'LRN already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insert new account with default role='student' and Is_validated=FALSE
    const [result] = await db.query(
      'INSERT INTO accounts (First_name, Last_name, LRN, Grade_level, Section, Email, Password, role, Is_validated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [First_name, Last_name, LRN, Grade_level, Section, Email, hashedPassword, 'student', false]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully',
      data: { 
        id: result.insertId,
        First_name,
        Last_name,
        Email,
        LRN
      }
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { LRN, Password } = req.body;

    // Validation
    if (!LRN || !Password) {
      return res.status(400).json({ 
        success: false, 
        error: 'LRN and password are required' 
      });
    }

    // Find account by LRN
    const [accounts] = await db.query(
      'SELECT * FROM accounts WHERE LRN = ?',
      [LRN]
    );

    if (accounts.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid LRN or password' 
      });
    }

    const account = accounts[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(Password, account.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Return account data without password
    const { Password: _, ...accountData } = account;

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: accountData
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get account by ID
const getAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const [accounts] = await db.query(
      'SELECT id, First_name, Last_name, LRN, Grade_level, Section, Email FROM accounts WHERE id = ?',
      [id]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }

    res.json({ success: true, data: accounts[0] });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update account
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { First_name, Last_name, Grade_level, Section, Email } = req.body;

    const updates = [];
    const values = [];

    if (First_name) { updates.push('First_name = ?'); values.push(First_name); }
    if (Last_name) { updates.push('Last_name = ?'); values.push(Last_name); }
    if (Grade_level) { updates.push('Grade_level = ?'); values.push(Grade_level); }
    if (Section) { updates.push('Section = ?'); values.push(Section); }
    if (Email) { updates.push('Email = ?'); values.push(Email); }

    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No fields to update' 
      });
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE accounts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Account not found' 
      });
    }

    const [updatedAccount] = await db.query(
      'SELECT id, First_name, Last_name, LRN, Grade_level, Section, Email FROM accounts WHERE id = ?',
      [id]
    );

    res.json({ success: true, data: updatedAccount[0] });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get account balance
const getAccountBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const [accounts] = await db.query(
      'SELECT balance FROM accounts WHERE id = ?',
      [id]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    res.json({ success: true, balance: accounts[0].balance || 0 });
  } catch (error) {
    console.error('Error fetching account balance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAccount,
  updateAccount,
  getAccountBalance
};
