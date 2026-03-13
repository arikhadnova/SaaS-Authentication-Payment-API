const express = require('express');
const router = express.Router();

// Place holder akan diisi berikutnya
router.post('/register', (req, res) => {
    res.json({ message: 'Register endpoint ready' });
});

router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint ready' });
});

module.exports = router;