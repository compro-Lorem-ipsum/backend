const express = require('express');
const upload = require("../config/upload");   
const router = express.Router();

const {
  createAbsensi,
  getAllAbsensi,
  getAbsensiById,
  updateAbsensi,
  deleteAbsensi,
  createAbsensiWithFace  
} = require('../controller/absensiController');

const { verifyToken } = require('../controller/adminController');

// CREATE (check_in / check_out)
router.post('/', createAbsensi);

// READ ALL
router.get('/', verifyToken, getAllAbsensi);

// READ BY ID
router.get('/:id', verifyToken, getAbsensiById);

// UPDATE
router.put('/:id', verifyToken, updateAbsensi);

// DELETE
router.delete('/:id', verifyToken, deleteAbsensi);

// ABSENSI WITH FACE
router.post("/face", upload.single("file"), createAbsensiWithFace);

module.exports = router;
