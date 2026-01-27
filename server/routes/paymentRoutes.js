const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET all payments for an account
router.get('/account/:account_id', paymentController.getAllPayments);

// GET single payment by ID
router.get('/:id', paymentController.getPaymentById);

// POST create new payment
router.post('/', paymentController.createPayment);

// DELETE payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
