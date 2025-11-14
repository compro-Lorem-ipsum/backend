const Absensi = require('../models/absensi');
const { knex } = require('../config/db');
const FLASK_URL = process.env.FLASK_URL;
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// CREATE absensi (check-in / check-out)
const createAbsensi = async (req, res) => {
  try {
    const { id_jadwal, nama, nip, tipe, waktu_absen } = req.body;

    if (!id_jadwal || !tipe || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, tipe, nama, dan nip wajib diisi' });
    }

    // Cek apakah satpam cocok dengan jadwal
    const check = await Absensi.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // Ambil data jam mulai dan jam selesai dari tabel jadwal_jaga
    const jadwal = await knex('jadwal_jaga')
      .where('id', id_jadwal)
      .select('jam_mulai', 'jam_selesai')
      .first();

    if (!jadwal) {
      return res.status(404).json({ message: 'Data jadwal tidak ditemukan' });
    }

    // Tentukan waktu absen (pakai waktu body atau waktu saat ini)
    const waktu = waktu_absen ? new Date(waktu_absen) : new Date();

    // Konversi jam mulai dan selesai jadi Date agar bisa dibandingkan
    const jamMulai = new Date(`1970-01-01T${jadwal.jam_mulai}`);
    const jamSelesai = new Date(`1970-01-01T${jadwal.jam_selesai}`);

    let status = 'Belum Absen';
    if (tipe === 'check_in') {
      status = waktu > jamMulai ? 'Telat' : 'Tepat Waktu';
    } else if (tipe === 'check_out') {
      status = waktu < jamSelesai ? 'Telat' : 'Tepat Waktu';
    }

    // Simpan ke database
    await Absensi.create({
      id_jadwal,
      tipe,
      waktu_absen: waktu,
      status
    });

    res.status(201).json({
      message: `Absensi ${tipe} berhasil dicatat`,
      status,
      satpam: check.satpam
    });
  } catch (err) {
    console.error('Error saat membuat absensi:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
const getAllAbsensi = async (req, res) => {
  try {
    const data = await Absensi.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error saat mengambil data absensi:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getAbsensiById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Absensi.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Data absensi tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error saat mengambil absensi berdasarkan ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE absensi (ubah waktu_absen atau status)
const updateAbsensi = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_jadwal, nama, nip, waktu_absen, status } = req.body;

    // Validasi input wajib
    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, nama, dan nip wajib diisi untuk update absensi' });
    }

    // Cek apakah satpam sesuai dengan jadwal
    const check = await Absensi.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // Siapkan data update
    const updateData = {};
    if (waktu_absen) updateData.waktu_absen = waktu_absen;
    if (status) updateData.status = status;

    // Jalankan update
    const updated = await Absensi.update(id, updateData);

    if (!updated) {
      return res.status(404).json({ message: 'Data absensi tidak ditemukan atau gagal diperbarui' });
    }

    res.status(200).json({
      message: 'Data absensi berhasil diperbarui',
      updated_by: check.satpam
    });
  } catch (err) {
    console.error('Error saat update absensi:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE absensi
const deleteAbsensi = async (req, res) => {
  try {
    const { id } = req.params;
    await Absensi.delete(id);
    res.status(200).json({ message: 'Data absensi berhasil dihapus' });
  } catch (err) {
    console.error('Error saat hapus absensi:', err);
    res.status(500).json({ error: err.message });
  }
};

// ============ ABSENSI DENGAN FACE RECOGNITION ============
const createAbsensiWithFace = async (req, res) => {
  try {
    const { id_jadwal, tipe } = req.body;

    console.log("📌 Incoming request body:", req.body);
    console.log("📌 Incoming file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Foto wajib diunggah" });
    }
    if (!id_jadwal || !tipe) {
      return res.status(400).json({ message: "id_jadwal dan tipe wajib" });
    }

    // ============================
    // 1️⃣ BACA FILE ASLI
    // ============================
    const imageBuffer = fs.readFileSync(req.file.path);
    console.log("📸 Image size (bytes):", imageBuffer.length);

    // ============================
    // 2️⃣ SEND IMAGE TO FLASK
    // ============================
    const form = new FormData();
    form.append("image", imageBuffer, req.file.originalname);
    form.append("threshold", "0.6");

    console.log("🚀 Sending request to Flask:", `${FLASK_URL}/verify`);

    const response = await axios.post(`${FLASK_URL}/verify`, form, {
      headers: form.getHeaders(),
    });

    console.log("✅ Flask response full:", response.data);

    const { matched, employee_id } = response.data;

    console.log("🔍 matched:", matched);
    console.log("👤 employee_id:", employee_id);

    if (!matched) {
      return res.status(403).json({ message: "Wajah tidak cocok" });
    }

    // ============================
    // 3️⃣ GET SATPAM DATA
    // ============================
    console.log("📥 Fetching SQL data for employee_id:", employee_id);

    const satpam = await knex("satpam")
      .where("id", employee_id)
      .first();

    console.log("📌 SQL satpam result:", satpam);

    if (!satpam) {
      return res.status(404).json({ message: "Data satpam tidak ditemukan" });
    }

    const { nama, nip } = satpam;

    // ============================
    // 4️⃣ CHECK SCHEDULE
    // ============================
    console.log("📅 Checking schedule for id_jadwal:", id_jadwal);

    const check = await Absensi.checkSatpamByJadwal(id_jadwal, nama, nip);
    console.log("📊 Schedule check result:", check);

    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // ============================
    // 5️⃣ HITUNG STATUS
    // ============================
    const jadwal = await knex("jadwal_jaga")
      .where("id", id_jadwal)
      .select("jam_mulai", "jam_selesai")
      .first();

    console.log("🕒 Jadwal:", jadwal);

    const waktu = new Date();
    const jamMulai = new Date(`1970-01-01T${jadwal.jam_mulai}`);
    const jamSelesai = new Date(`1970-01-01T${jadwal.jam_selesai}`);

    let status = "Belum Absen";

    if (tipe === "check_in") {
      status = waktu > jamMulai ? "Telat" : "Tepat Waktu";
    } else {
      status = waktu < jamSelesai ? "Telat" : "Tepat Waktu";
    }

    console.log("📘 Calculated status:", status);

    // ============================
    // 6️⃣ SIMPAN ABSENSI
    // ============================
    console.log("💾 Saving absensi...");

    await Absensi.create({
      id_jadwal,
      tipe,
      waktu_absen: waktu,
      status,
    });

    console.log("🎉 Absensi saved successfully");

    return res.status(201).json({
      message: `Absensi ${tipe} berhasil`,
      status,
      satpam: {
        id: satpam.id,
        nama: satpam.nama,
        nip: satpam.nip,
      },
    });

  } catch (err) {
    console.error("❌ Error createAbsensiWithFace:");
    console.error("🔥 Error Response:", err.response?.data);
    console.error("🔥 Error Message:", err.message);

    return res.status(500).json({ error: "Gagal absensi wajah" });
  }
};

module.exports = {
  createAbsensi,
  getAllAbsensi,
  getAbsensiById,
  updateAbsensi,
  deleteAbsensi,
  createAbsensiWithFace
};
