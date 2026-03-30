const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

const oauthCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return res.status(200).json({
      success: true,
      message: 'OAuth login successful',
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { oauthCallback };