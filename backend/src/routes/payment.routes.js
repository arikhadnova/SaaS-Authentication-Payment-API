const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public
/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment endpoints
 */

/**
 * @swagger
 * /payment/products:
 *   get:
 *     summary: Get all products
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Returns list of products
 */
router.get('/products', paymentController.getProducts);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Handle payment webhook from Midtrans
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/webhook', paymentController.handleWebhook);

// Protected
/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: uuid-product-id
 *     responses:
 *       201:
 *         description: Transaction created, returns snapUrl
 *       400:
 *         description: Product not found
 */
router.post('/create', authenticate, paymentController.createTransaction);

/**
 * @swagger
 * /payment/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of transactions
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authenticate, paymentController.getTransactionHistory);

module.exports = router;