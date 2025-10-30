const express = require('express');
const router = express.Router();
const {
  createPos,
  getAllPos,
  getPosById,
  updatePos,
  deletePos
} = require('../controller/posController');

const { verifyToken } = require('../controller/adminController');

// CREATE
router.post('/', verifyToken, createPos);

// READ ALL
router.get('/', verifyToken, getAllPos);

// READ BY ID
router.get('/:id', verifyToken, getPosById);

// UPDATE
router.put('/:id', verifyToken, updatePos);

// DELETE
router.delete('/:id', verifyToken, deletePos);

module.exports = router;
