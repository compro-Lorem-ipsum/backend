const express = require('express');
const router = express.Router();
const uploadLaporan = require("../config/upload");

const {
  createLaporan,
  getAllLaporan,
  getLaporanById,
  updateLaporan,
  deleteLaporan
} = require('../controller/laporanController');

const { verifyToken } = require('../controller/adminController');

// UPLOAD MULTI-FIELD
const uploadFields = uploadLaporan.fields([
  { name: "gambar1", maxCount: 1 },
  { name: "gambar2", maxCount: 1 },
  { name: "gambar3", maxCount: 1 },
  { name: "gambar4", maxCount: 1 },
]);

// CREATE
router.post('/', verifyToken, uploadFields, createLaporan);

// READ ALL
router.get('/', verifyToken, getAllLaporan);

// READ BY ID
router.get('/:id', verifyToken, getLaporanById);

// UPDATE
router.put('/:id', verifyToken, uploadFields, updateLaporan);

// DELETE
router.delete('/:id', verifyToken, deleteLaporan);

module.exports = router;
