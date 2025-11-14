const path = require("path");
const Satpam = require("../models/satpam");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const FLASK_URL = process.env.FLASK_URL; // contoh: http://localhost:5000

// CREATE — Tambah data satpam + ENROLL wajah ke Flask
const createSatpam = async (req, res) => {
  try {
    const { nama, asal_daerah, nip, no_telp } = req.body;

    if (!nama || !nip) {
      return res.status(400).json({ message: "Nama dan NIP wajib diisi" });
    }

    // ========================================
    // 1️⃣ INSERT DATA AWAL (gambar & milvus kosong)
    // ========================================
    const result = await Satpam.create({
      nama,
      asal_daerah,
      nip,
      no_telp,
      gambar: null,
      milvus_id: null
    });

    const insertedId = result[0]; // knex return array of IDs

    // ========================================
    // 2️⃣ UPDATE GAMBAR jika ada file
    // ========================================
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;

      await Satpam.update(insertedId, { gambar: imagePath });
    }

    // ========================================
    // 3️⃣ KIRIM GAMBAR KE FLASK UNTUK ENROLL
    // ========================================
    let milvus_id = null;

    if (req.file) {
      // BACA FILE ASLI DARI DISK, BUKAN req.file.buffer
      const imageBuffer = fs.readFileSync(req.file.path);

      const form = new FormData();
      form.append("image", imageBuffer, req.file.originalname);
      form.append("employee_id", insertedId);

      const flaskResp = await axios.post(`${FLASK_URL}/enroll`, form, {
        headers: form.getHeaders(),
      });

      // Ambil milvus_id/employee id dari response Flask
      milvus_id = flaskResp.data.employee_id;

      // Simpan milvus_id ke database
      await Satpam.update(insertedId, { milvus_id });
    }

    // ========================================
    // 4️⃣ RESPONSE KE FRONTEND
    // ========================================
    res.status(201).json({
      message: "Satpam & wajah berhasil ditambahkan",
      data: {
        id: insertedId,
        nama,
        nip,
        asal_daerah,
        no_telp,
        gambar: imagePath,
        milvus_id
      }
    });

  } catch (err) {
    console.error("🔥 ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Gagal menambahkan satpam" });
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
