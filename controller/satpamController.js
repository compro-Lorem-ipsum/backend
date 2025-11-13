const Satpam = require('../models/satpam');
const bucket = require('../config/firebase'); 

// CREATE — Tambah data satpam
const createSatpam = async (req, res) => {
  try {
    const { nama, asal_daerah, nip, no_telp, milvus_id } = req.body;

    // Validasi input
    if (!nama || !nip) {
      return res.status(400).json({ message: 'Nama dan NIP wajib diisi' });
    }

    let imageUrl = null;

     // Ambil file dari req.files
    const file = req.files?.find(f => f.fieldname === "gambar");

    if (file) {
      const fileBuffer = file.buffer;
      const mimeType = file.mimetype;
      const fileName = `satpam/${Date.now()}_${file.originalname}`;

      const storageFile = bucket.file(fileName);

      // Upload file ke firebase
      await storageFile.save(fileBuffer, {
        metadata: { contentType: mimeType },
      });

      // URL public
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Simpan ke DB dengan URL Firebase
    await Satpam.create({
      nama,
      asal_daerah,
      nip,
      no_telp,
      gambar: imageUrl,
      milvus_id
    });

    res.status(201).json({ 
      message: 'Data satpam berhasil ditambahkan',
      image_url: imageUrl
    });

  } catch (err) {
    console.error('Error createSatpam:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ — Ambil semua data satpam
const getAllSatpam = async (req, res) => {
  try {
    const data = await Satpam.getAll();

    const result = await Promise.all(
      data.map(async (item) => {
        if (item.gambar) {
          // Ambil path file dari URL Firebase Storage
          const filePath = item.gambar.replace(
            `https://storage.googleapis.com/${bucket.name}/`,
            ""
          );

          const file = bucket.file(filePath);

          // Ambil buffer & metadata (contentType)
          const [buffer] = await file.download();
          const [metadata] = await file.getMetadata();

          const mimeType = metadata.contentType; // image/png, image/jpeg, etc.
          const base64Image = buffer.toString("base64");

          return {
            ...item,
            gambar: `data:${mimeType};base64,${base64Image}`, // dynamic mimetype
          };
        }

        return item; 
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Error getAllSatpam:", err);
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

    // Jika ada gambar, ambil dari Firebase
    if (data.gambar) {
      const filePath = data.gambar.replace(
        `https://storage.googleapis.com/${bucket.name}/`,
        ""
      );

      const file = bucket.file(filePath);

      const [buffer] = await file.download();
      const [metadata] = await file.getMetadata();
      const mimeType = metadata.contentType;

      const base64Image = buffer.toString("base64");

      data.gambar = `data:${mimeType};base64,${base64Image}`;
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Error getSatpamById:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE — Ubah data satpam
const updateSatpam = async (req, res) => {
  try {
    const { id } = req.params;

    // ambil data lama
    const oldData = await Satpam.getById(id);
    if (!oldData) {
      return res.status(404).json({ message: 'Satpam tidak ditemukan' });
    }

    const updateData = { ...req.body };

    // Jika ada file baru diupload
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;
      const fileName = `satpam/${Date.now()}_${req.file.originalname}`;

      const storageFile = bucket.file(fileName);

      await storageFile.save(fileBuffer, {
        metadata: { contentType: mimeType },
      });

      // Simpan link baru
      updateData.gambar = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Update DB
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
