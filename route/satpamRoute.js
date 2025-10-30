const express = require('express');
const {
  createSatpam,
  getAllSatpam,
  getSatpamById,
  updateSatpam,
  deleteSatpam
} = require('../controller/satpamController');

const { verifyToken } = require('../controller/adminController');

const router = express.Router();

// CREATE
router.post('/', verifyToken, createSatpam);

// READ
router.get('/', verifyToken, getAllSatpam);
router.get('/:id', verifyToken, getSatpamById);

// UPDATE
router.put('/:id', verifyToken, updateSatpam);

// DELETE
router.delete('/:id', verifyToken, deleteSatpam);

module.exports = router;
