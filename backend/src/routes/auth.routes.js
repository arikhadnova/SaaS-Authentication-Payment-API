const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Place holder akan diisi berikutnya
router.post('/register', authController.register);
router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint ready' });
});

module.exports = router;