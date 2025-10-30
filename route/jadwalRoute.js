const express = require('express');
const router = express.Router();
const {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal
} = require('../controller/jadwalController');

const { verifyToken } = require('../controller/adminController');

// CREATE jadwal baru
// Body: { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai }
router.post('/', verifyToken, createJadwal);

// GET semua jadwal
router.get('/', verifyToken, getAllJadwal);

// GET jadwal berdasarkan ID
router.get('/:id', verifyToken, getJadwalById);

// UPDATE jadwal berdasarkan ID
// Body: { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai }
router.put('/:id', verifyToken, updateJadwal);

// DELETE jadwal berdasarkan ID
router.delete('/:id', verifyToken, deleteJadwal);

module.exports = router;
