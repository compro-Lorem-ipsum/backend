const express = require('express');
const upload = require("../config/upload");   

const {
  createSatpam,
  getAllSatpam,
  getSatpamById,
  updateSatpam,
  deleteSatpam,
} = require('../controller/satpamController');

const { verifyToken } = require('../controller/adminController');

const router = express.Router();

// CREATE — Satpam dengan upload gambar
router.post('/', verifyToken, upload.single("gambar"), createSatpam);

// READ
router.get('/', verifyToken, getAllSatpam);
router.get('/:id', verifyToken, getSatpamById);

// UPDATE — Upload gambar baru optional
router.put('/:id', verifyToken, upload.single("gambar"), updateSatpam);

// DELETE
router.delete('/:id', verifyToken, deleteSatpam);

module.exports = router;
