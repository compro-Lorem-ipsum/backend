const Laporan = require('../models/laporan');

// CREATE
const createLaporan = async (req, res) => {
  try {
    const { id_jadwal, nama, nip, status_lokasi, keterangan, gambar1, gambar2, gambar3, gambar4 } = req.body;

    // Validasi input wajib
    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, nama, dan nip wajib diisi' });
    }

    // Cek apakah satpam sesuai dengan jadwal
    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // Jika cocok, buat laporan baru
    await Laporan.create({
      id_jadwal,
      status_lokasi,
      keterangan,
      gambar1,
      gambar2,
      gambar3,
      gambar4
    });

    res.status(201).json({
      message: 'Laporan berhasil ditambahkan',
      satpam: check.satpam
    });
  } catch (err) {
    console.error('Error saat membuat laporan:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
const getAllLaporan = async (req, res) => {
  try {
    const data = await Laporan.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error saat mengambil semua laporan:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Laporan.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error saat mengambil laporan berdasarkan ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE — hanya satpam yang sesuai jadwal boleh update
const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_jadwal, nama, nip, status_lokasi, keterangan, gambar1, gambar2, gambar3, gambar4 } = req.body;

    // Cek data wajib
    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, nama, dan nip wajib diisi untuk update laporan' });
    }

    // Cek apakah satpam benar yang bertugas
    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // Siapkan data yang akan diperbarui
    const updateData = {
      id_jadwal,
      status_lokasi,
      keterangan,
      gambar1,
      gambar2,
      gambar3,
      gambar4
    };

    // Lakukan update
    const updated = await Laporan.update(id, updateData);

    if (!updated) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan atau gagal diperbarui' });
    }

    res.status(200).json({
      message: 'Laporan berhasil diperbarui',
      updated_by: check.satpam
    });
  } catch (err) {
    console.error('Error saat memperbarui laporan:', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    await Laporan.delete(id);
    res.status(200).json({ message: 'Laporan berhasil dihapus' });
  } catch (err) {
    console.error('Error saat menghapus laporan:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createLaporan,
  getAllLaporan,
  getLaporanById,
  updateLaporan,
  deleteLaporan
};
