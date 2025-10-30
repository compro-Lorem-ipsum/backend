const Jadwal = require('../models/jadwal');

// CREATE
const createJadwal = async (req, res) => {
  try {
    const { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai } = req.body;

    if (!id_satpam || !id_pos || !tanggal || !jam_mulai || !jam_selesai) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Validasi waktu
    if (jam_selesai <= jam_mulai) {
      return res.status(400).json({ message: 'Jam selesai harus lebih besar dari jam mulai' });
    }

    // Cek apakah satpam sudah punya jadwal di tanggal & jam yang sama
    const conflict = await Jadwal.checkConflict({ id_satpam, tanggal, jam_mulai, jam_selesai });
    if (conflict) {
      return res.status(400).json({ message: 'Satpam sudah memiliki jadwal yang bentrok pada jam dan tanggal ini.' });
    }

    await Jadwal.create({ id_satpam, id_pos, tanggal, jam_mulai, jam_selesai });
    res.status(201).json({ message: 'Jadwal berhasil ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai } = req.body;

    if (!id_satpam || !id_pos || !tanggal || !jam_mulai || !jam_selesai) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Validasi waktu
    if (jam_selesai <= jam_mulai) {
      return res.status(400).json({ message: 'Jam selesai harus lebih besar dari jam mulai' });
    }

    // Cek bentrok dengan jadwal lain (kecuali dirinya sendiri)
    const conflict = await Jadwal.checkConflict({ id_satpam, tanggal, jam_mulai, jam_selesai, excludeId: id });
    if (conflict) {
      return res.status(400).json({ message: 'Satpam sudah memiliki jadwal lain yang bentrok pada jam dan tanggal ini.' });
    }

    await Jadwal.update(id, { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai });
    res.status(200).json({ message: 'Jadwal berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    await Jadwal.delete(id);
    res.status(200).json({ message: 'Jadwal berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
const getAllJadwal = async (req, res) => {
  try {
    const jadwal = await Jadwal.getAll();
    res.status(200).json(jadwal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getJadwalById = async (req, res) => {
  try {
    const { id } = req.params;
    const jadwal = await Jadwal.getById(id);

    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.status(200).json(jadwal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal
};
