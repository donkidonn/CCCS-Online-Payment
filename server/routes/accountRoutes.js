const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// POST register new account
router.post('/register', accountController.register);

// POST login
router.post('/login', accountController.login);

// GET account balance
router.get('/:id/balance', accountController.getAccountBalance);

// GET comprehensive account balance details
router.get('/:id/balance-details', accountController.getAccountBalanceDetails);

// GET account by ID
router.get('/:id', accountController.getAccount);

// PUT update account
router.put('/:id', accountController.updateAccount);

module.exports = router;
