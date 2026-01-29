const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// POST register new account
router.post('/register', accountController.register);

// POST login
router.post('/login', accountController.login);

// GET search accounts - must be before /:id routes
router.get('/search', accountController.searchAccounts);

// GET search balances - must be before /:id routes
router.get('/search-balances', accountController.searchBalances);

// GET all student balances - must be before /:id
router.get('/all-balances', accountController.getAllBalances);

// GET accounts by status (verified/unverified) - must be before /:id
router.get('/status/:status', accountController.getAccountsByStatus);

// GET account balance
router.get('/:id/balance', accountController.getAccountBalance);

// GET comprehensive account balance details
router.get('/:id/balance-details', accountController.getAccountBalanceDetails);

// PUT update account balance
router.put('/:id/balance', accountController.updateBalance);

// PUT verify an account
router.put('/:id/verify', accountController.verifyAccount);

// PUT unverify an account
router.put('/:id/unverify', accountController.unverifyAccount);

// GET account by ID
router.get('/:id', accountController.getAccount);

// PUT update account
router.put('/:id', accountController.updateAccount);

// DELETE an account
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
