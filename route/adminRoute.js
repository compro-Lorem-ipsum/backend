const express = require('express');
const { registerAdmin, login, verifyToken, updateAdmin, deleteAdmin } = require('../controller/adminController');
const router = express.Router();

// Login
router.post('/login', login);

// Register (hanya SuperAdmin)
router.post('/register', verifyToken, registerAdmin);

// Update admin (ubah password atau role)
router.put('/update/:id', verifyToken, updateAdmin);

// Delete admin (SuperAdmin only)
router.delete('/delete/:id', verifyToken, deleteAdmin);

// Verifikasi token
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token valid', user: req.user });
});

module.exports = router;
