const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

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
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

module.exports = { register };