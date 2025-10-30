const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
require('dotenv').config();

// REGISTER ADMIN — hanya bisa dilakukan oleh SuperAdmin
const registerAdmin = async (req, res) => {
    try {
        const { nama, username, password, role } = req.body;

        // Validasi input
        if (!nama || !username || !password) {
            return res.status(400).json({ message: 'Nama, username, dan password wajib diisi' });
        }

        // Pastikan hanya SuperAdmin yang bisa membuat akun admin
        if (!req.user || req.user.role !== 'SuperAdmin') {
            return res.status(403).json({ message: 'Hanya SuperAdmin yang bisa membuat akun admin' });
        }

        // Cek apakah username sudah digunakan
        const existingUser = await Admin.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }

        // Enkripsi password
        const hashedPass = await bcrypt.hash(password, 10);

        // Buat akun baru
        await Admin.create({
            nama,
            username,
            password: hashedPass,
            role: role || 'Admin'
        });

        return res.status(201).json({ message: 'Akun admin berhasil dibuat!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// LOGIN ADMIN / SUPERADMIN
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Masukkan username dan password' });
        }

        const user = await Admin.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        // Buat token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        return res.status(200).json({
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                nama: user.nama,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// UPDATE ADMIN (tidak bisa ubah SuperAdmin)
const updateAdmin = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nama, password, role } = req.body;

        if (!id) return res.status(400).json({ message: 'ID admin wajib diisi' });

        const target = await Admin.findById(id);
        if (!target) return res.status(404).json({ message: 'Admin tidak ditemukan' });

        if (target.role === 'SuperAdmin') {
            return res.status(403).json({ message: 'SuperAdmin tidak dapat diubah' });
        }

        const updateData = {};

        if (nama) updateData.nama = nama;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (role) {
            // Hanya SuperAdmin boleh ubah role orang lain
            if (!req.user || req.user.role !== 'SuperAdmin') {
                return res.status(403).json({ message: 'Hanya SuperAdmin yang bisa ubah role admin' });
            }
            updateData.role = role;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Tidak ada data untuk diperbarui' });
        }

        await Admin.update(id, updateData);
        return res.status(200).json({ message: 'Data admin berhasil diperbarui' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// DELETE ADMIN (tidak bisa hapus SuperAdmin)
const deleteAdmin = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (!id) return res.status(400).json({ message: 'ID admin wajib diisi' });

        if (!req.user || req.user.role !== 'SuperAdmin') {
            return res.status(403).json({ message: 'Hanya SuperAdmin yang bisa menghapus admin' });
        }

        const deleted = await Admin.delete(id);

        if (deleted === 0) {
            return res.status(404).json({ message: 'Admin tidak ditemukan atau tidak dapat dihapus' });
        }

        return res.status(200).json({ message: 'Admin berhasil dihapus' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

// Verifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer token"

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.user = decoded;
        next();
    });
};

module.exports = {
    registerAdmin,
    login,
    updateAdmin,
    deleteAdmin,
    verifyToken
};
