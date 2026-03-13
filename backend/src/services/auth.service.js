const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (email, password, name) => {

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error('User already registered');
    }

    // Hash password — angka 10 adalah "salt rounds"
    // Makin tinggi makin aman, tapi makin lambat
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            provider: 'local',
        },
    });

    // Kembalikan data user tanpa password
    const { password: _pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const login = async (email, password) => {

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Bandingkan password dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate kedua token
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Simpan refresh token ke database
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    // Kembalikan data user tanpa password
    const { password: _pwd, ...userWithoutPassword } = user;

    return {
        accessToken,
        refreshToken,
        user: userWithoutPassword
    };
};

const refresh = async (refreshToken) => {
        // Verifikasi token valid secara signature
        const payload = verifyRefreshToken(refreshToken);

        // Cek apakah token ada di database (belum di-revoke)
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!storedToken) {
            throw new Error('Refresh token not found');
        }

        // Cek apakah token sudah expired
        if (storedToken.expiresAt < new Date()) {
            throw new Error('Refresh token expired');
        }

        // Generate access token baru
        const accessToken = generateAccessToken(payload.id);

        return { accessToken };
};

const logout = async (refreshToken) => {

    // Hapus refresh token dari database
    await prisma.refreshToken.delete({
        where: { token: refreshToken }
    });

    return true;
};

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const { password: _pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

module.exports = { 
    register, 
    login, 
    refresh, 
    logout,
    getMe 
};