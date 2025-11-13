const Laporan = require('../models/laporan');
const bucket = require('../config/firebase'); 

// CREATE
const createLaporan = async (req, res) => {
  try {
    const { id_jadwal, nama, nip, status_lokasi, keterangan } = req.body;

    // Validasi input wajib
    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: 'id_jadwal, nama, dan nip wajib diisi' });
    }

    // Cek apakah satpam sesuai jadwal
    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // MIRIP SATPAM: 
    // Cari setiap gambar berdasarkan fieldname
    const gambar1File = req.files?.find(f => f.fieldname === "gambar1");
    const gambar2File = req.files?.find(f => f.fieldname === "gambar2");
    const gambar3File = req.files?.find(f => f.fieldname === "gambar3");
    const gambar4File = req.files?.find(f => f.fieldname === "gambar4");

    // Upload setiap gambar jika ada
    async function upload(file, folder) {
      if (!file) return null;

      const buffer = file.buffer;
      const mimeType = file.mimetype;
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;

      const storageFile = bucket.file(fileName);

      await storageFile.save(buffer, {
        metadata: { contentType: mimeType },
      });

      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const gambar1Url = await upload(gambar1File, "laporan");
    const gambar2Url = await upload(gambar2File, "laporan");
    const gambar3Url = await upload(gambar3File, "laporan");
    const gambar4Url = await upload(gambar4File, "laporan");

    // INSERT ke database
    await Laporan.create({
      id_jadwal,
      status_lokasi,
      keterangan,
      gambar1: gambar1Url,
      gambar2: gambar2Url,
      gambar3: gambar3Url,
      gambar4: gambar4Url
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

// READ ALL
const getAllLaporan = async (req, res) => {
  try {
    const data = await Laporan.getAll();

    const result = await Promise.all(
      data.map(async (lap) => {
        
        // gambar1
        if (lap.gambar1) {
          const path1 = lap.gambar1.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
          const file1 = bucket.file(path1);
          const [buf1] = await file1.download();
          const [meta1] = await file1.getMetadata();
          lap.gambar1 = `data:${meta1.contentType};base64,${buf1.toString("base64")}`;
        }

        // gambar2
        if (lap.gambar2) {
          const path2 = lap.gambar2.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
          const file2 = bucket.file(path2);
          const [buf2] = await file2.download();
          const [meta2] = await file2.getMetadata();
          lap.gambar2 = `data:${meta2.contentType};base64,${buf2.toString("base64")}`;
        }

        // gambar3
        if (lap.gambar3) {
          const path3 = lap.gambar3.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
          const file3 = bucket.file(path3);
          const [buf3] = await file3.download();
          const [meta3] = await file3.getMetadata();
          lap.gambar3 = `data:${meta3.contentType};base64,${buf3.toString("base64")}`;
        }

        // gambar4
        if (lap.gambar4) {
          const path4 = lap.gambar4.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
          const file4 = bucket.file(path4);
          const [buf4] = await file4.download();
          const [meta4] = await file4.getMetadata();
          lap.gambar4 = `data:${meta4.contentType};base64,${buf4.toString("base64")}`;
        }

        return lap;
      })
    );

    res.status(200).json(result);

  } catch (err) {
    console.error("Error getAllLaporan:", err);
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    const lap = await Laporan.getById(id);

    if (!lap) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    // gambar1
    if (lap.gambar1) {
      const p1 = lap.gambar1.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
      const f1 = bucket.file(p1);
      const [b1] = await f1.download();
      const [m1] = await f1.getMetadata();
      lap.gambar1 = `data:${m1.contentType};base64,${b1.toString("base64")}`;
    }

    // gambar2
    if (lap.gambar2) {
      const p2 = lap.gambar2.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
      const f2 = bucket.file(p2);
      const [b2] = await f2.download();
      const [m2] = await f2.getMetadata();
      lap.gambar2 = `data:${m2.contentType};base64,${b2.toString("base64")}`;
    }

    // gambar3
    if (lap.gambar3) {
      const p3 = lap.gambar3.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
      const f3 = bucket.file(p3);
      const [b3] = await f3.download();
      const [m3] = await f3.getMetadata();
      lap.gambar3 = `data:${m3.contentType};base64,${b3.toString("base64")}`;
    }

    // gambar4
    if (lap.gambar4) {
      const p4 = lap.gambar4.replace(`https://storage.googleapis.com/${bucket.name}/`, "");
      const f4 = bucket.file(p4);
      const [b4] = await f4.download();
      const [m4] = await f4.getMetadata();
      lap.gambar4 = `data:${m4.contentType};base64,${b4.toString("base64")}`;
    }

    res.status(200).json(lap);

  } catch (err) {
    console.error("Error getLaporanById:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE — hanya satpam yang sesuai jadwal boleh update
const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_jadwal, nama, nip, status_lokasi, keterangan } = req.body;

    // Validasi wajib
    if (!id_jadwal || !nama || !nip) {
      return res.status(400).json({ message: "id_jadwal, nama, nip wajib diisi" });
    }

    // Validasi satpam sesuai jadwal
    const check = await Laporan.checkSatpamByJadwal(id_jadwal, nama, nip);
    if (!check.valid) {
      return res.status(403).json({ message: check.message });
    }

    // Ambil file baru dari req.files
    const gambar1File = req.files?.find(f => f.fieldname === "gambar1");
    const gambar2File = req.files?.find(f => f.fieldname === "gambar2");
    const gambar3File = req.files?.find(f => f.fieldname === "gambar3");
    const gambar4File = req.files?.find(f => f.fieldname === "gambar4");

    // Helper upload (seperti Satpam)
    async function upload(file, folder) {
      if (!file) return null;

      const buffer = file.buffer;
      const mimetype = file.mimetype;
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      const storageFile = bucket.file(fileName);

      await storageFile.save(buffer, {
        metadata: { contentType: mimetype },
      });

      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Upload file baru jika dikirim
    const updateData = {
      status_lokasi,
      keterangan
    };

    if (gambar1File) updateData.gambar1 = await upload(gambar1File, "laporan");
    if (gambar2File) updateData.gambar2 = await upload(gambar2File, "laporan");
    if (gambar3File) updateData.gambar3 = await upload(gambar3File, "laporan");
    if (gambar4File) updateData.gambar4 = await upload(gambar4File, "laporan");

    const updated = await Laporan.update(id, updateData);

    if (!updated) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

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
