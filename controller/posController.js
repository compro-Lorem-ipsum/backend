const Pos = require('../models/pos');

// CREATE
const createPos = async (req, res) => {
  try {
    const { kode_pos, nama_pos, latitude, longitude } = req.body;

    // Validasi input
    if (!kode_pos || !nama_pos) {
      return res.status(400).json({ message: 'Kode pos dan nama pos wajib diisi' });
    }

    await Pos.create({ kode_pos, nama_pos, latitude, longitude });
    res.status(201).json({ message: 'Pos berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
const getAllPos = async (req, res) => {
  try {
    const data = await Pos.getAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getPosById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Pos.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Pos tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updatePos = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_pos, nama_pos, latitude, longitude } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID pos wajib disertakan' });
    }

    await Pos.update(id, { kode_pos, nama_pos, latitude, longitude });
    res.status(200).json({ message: 'Data pos berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deletePos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID pos wajib disertakan' });
    }

    await Pos.delete(id);
    res.status(200).json({ message: 'Pos berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPos,
  getAllPos,
  getPosById,
  updatePos,
  deletePos
};
