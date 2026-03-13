const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Place holder akan diisi berikutnya
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected route — hanya bisa diakses dengan token valid
router.get('/me', authenticate, authController.getMe);

module.exports = router;