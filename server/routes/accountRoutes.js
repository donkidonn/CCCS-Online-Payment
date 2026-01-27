const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// POST register new account
router.post('/register', accountController.register);

// POST login
router.post('/login', accountController.login);

// GET account by ID
router.get('/:id', accountController.getAccount);

// GET account balance
router.get('/:id/balance', accountController.getAccountBalance);

// PUT update account
router.put('/:id', accountController.updateAccount);

module.exports = router;
