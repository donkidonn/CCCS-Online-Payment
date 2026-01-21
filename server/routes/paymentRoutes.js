const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET all payments
router.get('/', paymentController.getAllPayments);

// GET single payment by ID
router.get('/:id', paymentController.getPaymentById);

// POST create new payment
router.post('/', paymentController.createPayment);

// PUT update payment
router.put('/:id', paymentController.updatePayment);

// DELETE payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
