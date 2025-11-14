const path = require("path");
const Laporan = require("../models/laporan");

// Helper ambil file jika ada
const getFilePath = (files, field) => {
  if (!files || !files[field] || files[field].length === 0) return null;
  return `/uploads/${files[field][0].filename}`;
};

// CREATE
const createLaporan = async (req, res) => {
  try {
    const { id_jadwal, nama, nip, status_lokasi, keterangan } = req.body;

    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, nama, dan nip wajib diisi' });
    }

    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) return res.status(403).json({ message: check.message });

    const files = req.files;

    await Laporan.create({
      id_jadwal,
      status_lokasi,
      keterangan,
      gambar1: getFilePath(files, "gambar1"),
      gambar2: getFilePath(files, "gambar2"),
      gambar3: getFilePath(files, "gambar3"),
      gambar4: getFilePath(files, "gambar4")
    });

    res.status(201).json({
      message: "Laporan berhasil ditambahkan",
      satpam: check.satpam
    });

  } catch (err) {
    console.error('Error createLaporan:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
const getAllLaporan = async (req, res) => {
  try {
    const data = await Laporan.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getAllLaporan:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    const lap = await Laporan.getById(id);

    if (!lap) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    res.status(200).json(lap);

  } catch (err) {
    console.error("Error getLaporanById:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_jadwal, nama, nip, status_lokasi, keterangan } = req.body;

    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: "id_jadwal, nama, nip wajib diisi" });
    }

    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) return res.status(403).json({ message: check.message });

    const files = req.files;

    const updateData = {
      status_lokasi,
      keterangan,
    };

    if (files["gambar1"]) updateData.gambar1 = getFilePath(files, "gambar1");
    if (files["gambar2"]) updateData.gambar2 = getFilePath(files, "gambar2");
    if (files["gambar3"]) updateData.gambar3 = getFilePath(files, "gambar3");
    if (files["gambar4"]) updateData.gambar4 = getFilePath(files, "gambar4");

    const updated = await Laporan.update(id, updateData);

    if (!updated) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    res.status(200).json({
      message: "Laporan berhasil diperbarui",
      updated_by: check.satpam
    });

  } catch (err) {
    console.error("Error update laporan:", err);
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
