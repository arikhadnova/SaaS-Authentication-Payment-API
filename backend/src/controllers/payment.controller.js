const paymentService = require('../services/payment.service');

const getProducts = async (req, res) => {
  try {
    const products = await paymentService.getProducts();
    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const result = await paymentService.createTransaction(userId, productId);

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await paymentService.getTransactionHistory(userId);

    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getProducts, createTransaction, getTransactionHistory };