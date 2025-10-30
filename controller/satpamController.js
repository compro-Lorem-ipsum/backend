const Satpam = require('../models/satpam');

// CREATE — Tambah data satpam
const createSatpam = async (req, res) => {
  try {
    const { nama, asal_daerah, nip, no_telp, milvus_id } = req.body;
    const gambar = req.file ? req.file.path : req.body.gambar || null; // gunakan multer atau URL langsung

    // Validasi input
    if (!nama || !nip) {
      return res.status(400).json({ message: 'Nama dan NIP wajib diisi' });
    }

    await Satpam.create({
      nama,
      asal_daerah,
      nip,
      no_telp,
      gambar,
      milvus_id
    });

    res.status(201).json({ message: 'Data satpam berhasil ditambahkan' });
  } catch (err) {
    console.error('Error createSatpam:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ — Ambil semua data satpam
const getAllSatpam = async (req, res) => {
  try {
    const data = await Satpam.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error getAllSatpam:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ — Ambil satpam berdasarkan ID
const getSatpamById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Satpam.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Satpam tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error getSatpamById:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE — Ubah data satpam
const updateSatpam = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.gambar = req.file.path; // kalau ada file baru diupload
    }

    await Satpam.update(id, updateData);
    res.status(200).json({ message: 'Data satpam berhasil diperbarui' });
  } catch (err) {
    console.error('Error updateSatpam:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE — Hapus data satpam
const deleteSatpam = async (req, res) => {
  try {
    const { id } = req.params;
    await Satpam.delete(id);
    res.status(200).json({ message: 'Data satpam berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteSatpam:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSatpam,
  getAllSatpam,
  getSatpamById,
  updateSatpam,
  deleteSatpam
};
