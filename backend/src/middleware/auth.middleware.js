const { verifyAccessToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    try {
        // Ambil header Authorization
        const authHeader = req.headers.authorization;

        // Format header harus: "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Pisahkan "Bearer" dari tokennya
        const token = authHeader.split(' ')[1];

        // Verifikasi token
        const payload = verifyAccessToken(token);
        console.log('payload:', payload);

        // Simpan userId ke req.user agar bisa diakses controller
        req.user = { userId: payload.userId };

        // Teruskan request ke controller
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired access token'
        });
    }
};

module.exports = { authenticate };