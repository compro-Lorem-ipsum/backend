const express = require('express');
const router = express.Router();
const {
  createLaporan,
  getAllLaporan,
  getLaporanById,
  updateLaporan,
  deleteLaporan
} = require('../controller/laporanController');

const { verifyToken } = require('../controller/adminController');

// CREATE
router.post('/', createLaporan);

// READ ALL
router.get('/', verifyToken, getAllLaporan);

// READ BY ID
router.get('/:id', verifyToken, getLaporanById);

// UPDATE
router.put('/:id', verifyToken, updateLaporan);

// DELETE
router.delete('/:id',verifyToken,  deleteLaporan);

module.exports = router;
