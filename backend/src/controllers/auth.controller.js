const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validasi input dasar
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        const user = await authService.register(email, password, name);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register };