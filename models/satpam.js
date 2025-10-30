const { knex } = require('../config/db');

class Satpam {
  // CREATE — Tambah data satpam baru
  static async create({ nama, asal_daerah, nip, no_telp, gambar, milvus_id }) {
    return knex('satpam').insert({
      nama,
      asal_daerah,
      nip,
      no_telp,
      gambar,
      milvus_id
    });
  }

  // READ — Ambil semua data satpam
  static async getAll() {
    return knex('satpam').select(
      'id',
      'nama',
      'asal_daerah',
      'nip',
      'no_telp',
      'gambar',
      'milvus_id',
      'created_at'
    ).orderBy('id', 'asc');
  }

  // READ — Ambil satpam berdasarkan ID
  static async getById(id) {
    return knex('satpam').where({ id }).first();
  }

  // UPDATE — Ubah data satpam (bisa ubah sebagian)
  static async update(id, data) {
    return knex('satpam').where({ id }).update(data);
  }

  // DELETE — Hapus data satpam berdasarkan ID
  static async delete(id) {
    return knex('satpam').where({ id }).del();
  }
}

module.exports = Satpam;
