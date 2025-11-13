const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createLaporan,
  getAllLaporan,
  getLaporanById,
  updateLaporan,
  deleteLaporan
} = require('../controller/laporanController');

const { verifyToken } = require('../controller/adminController');

// CREATE
router.post('/', upload.any(), createLaporan);

// READ ALL
router.get('/', verifyToken, getAllLaporan);

// READ BY ID
router.get('/:id', verifyToken, getLaporanById);

// UPDATE
router.put('/:id', verifyToken, upload.any(), updateLaporan);

// DELETE
router.delete('/:id',verifyToken,  deleteLaporan);

module.exports = router;
