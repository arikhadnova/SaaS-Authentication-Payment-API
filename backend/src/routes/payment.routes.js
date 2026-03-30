const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/products', paymentController.getProducts);
router.post('/webhook', paymentController.handleWebhook);
router.post('/create', authenticate, paymentController.createTransaction);
router.get('/history', authenticate, paymentController.getTransactionHistory);

module.exports = router;