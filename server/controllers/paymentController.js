const db = require('../config/database');

// Get all payments for an account
const getAllPayments = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM payments WHERE account_id = ? ORDER BY paid_at DESC',
      [account_id]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM payments WHERE payment_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new payment
const createPayment = async (req, res) => {
  try {
    const { account_id, amount_paid, paypal_reference } = req.body;

    // Validation
    if (!account_id || !amount_paid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Account ID and amount are required' 
      });
    }

    // Insert payment record
    const [result] = await db.query(
      'INSERT INTO payments (account_id, amount_paid, paypal_reference) VALUES (?, ?, ?)',
      [account_id, parseFloat(amount_paid), paypal_reference]
    );

    // Update account balance (reduce balance)
    await db.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [parseFloat(amount_paid), account_id]
    );

    const [newPayment] = await db.query(
      'SELECT * FROM payments WHERE payment_id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newPayment[0] });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, amount, description, status } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (amount) { updates.push('amount = ?'); values.push(parseFloat(amount)); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (status) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    const [updatedPayment] = await db.query(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );

    res.json({ success: true, data: updatedPayment[0] });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM payments WHERE payment_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  deletePayment
};
