const Absensi = require('../models/absensi');
const { knex } = require('../config/db');

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

module.exports = {
  createAbsensi,
  getAllAbsensi,
  getAbsensiById,
  updateAbsensi,
  deleteAbsensi
};
