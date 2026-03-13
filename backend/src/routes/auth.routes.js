const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Place holder akan diisi berikutnya
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;