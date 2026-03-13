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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input dasar
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Validasi input dasar
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const result = await authService.refresh(refreshToken);

        res.status(200).json({
            success: true,
            message: 'Refresh token successful',
            data: result
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Validasi input dasar
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const result = await authService.logout(refreshToken);

        res.status(200).json({
            success: true,
            message: 'Logout successful',
            data: result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { 
    register, 
    login, 
    refresh, 
    logout 
};