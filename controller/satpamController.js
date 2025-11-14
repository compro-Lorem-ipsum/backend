const path = require("path");
const Satpam = require("../models/satpam");

// CREATE — Tambah data satpam
const createSatpam = async (req, res) => {
  try {
    const { nama, asal_daerah, nip, no_telp, milvus_id } = req.body;

    if (!nama || !nip) {
      return res.status(400).json({ message: "Nama dan NIP wajib diisi" });
    }

    let imagePath = null;

    // Jika ada upload gambar
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    await Satpam.create({
      nama,
      asal_daerah,
      nip,
      no_telp,
      gambar: imagePath,
      milvus_id,
    });

    res.status(201).json({
      message: "Data satpam berhasil ditambahkan",
      image_url: imagePath,
    });

  } catch (err) {
    console.error("Error createSatpam:", err);
    res.status(500).json({ error: err.message });
  }
};

// READ — Ambil semua satpam
const getAllSatpam = async (req, res) => {
  try {
    const data = await Satpam.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getAllSatpam:", err);
    res.status(500).json({ error: err.message });
  }
};

// READ — Ambil satpam by ID
const getSatpamById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Satpam.getById(id);

    if (!data) {
      return res.status(404).json({ message: "Satpam tidak ditemukan" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error getSatpamById:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE — Satpam
const updateSatpam = async (req, res) => {
  try {
    const { id } = req.params;

    const oldData = await Satpam.getById(id);
    if (!oldData) {
      return res.status(404).json({ message: "Satpam tidak ditemukan" });
    }

    const updateData = { ...req.body };

    // Jika upload gambar baru
    if (req.file) {
      updateData.gambar = `/uploads/${req.file.filename}`;
    }

    await Satpam.update(id, updateData);

    res.status(200).json({ message: "Data satpam berhasil diperbarui" });
  } catch (err) {
    console.error("Error updateSatpam:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE — Hapus satpam
const deleteSatpam = async (req, res) => {
  try {
    const { id } = req.params;

    await Satpam.delete(id);

    res.status(200).json({ message: "Data satpam berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteSatpam:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSatpam,
  getAllSatpam,
  getSatpamById,
  updateSatpam,
  deleteSatpam,
};
