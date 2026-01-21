const db = require('../config/database');

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM payments ORDER BY created_at DESC'
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
      'SELECT * FROM payments WHERE id = ?',
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
    const { name, email, amount, description } = req.body;

    // Validation
    if (!name || !email || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and amount are required' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO payments (name, email, amount, description, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, parseFloat(amount), description, 'pending']
    );

    const [newPayment] = await db.query(
      'SELECT * FROM payments WHERE id = ?',
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
      'DELETE FROM payments WHERE id = ?',
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
  updatePayment,
  deletePayment
};
