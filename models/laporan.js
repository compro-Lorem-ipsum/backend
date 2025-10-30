const { knex } = require('../config/db');

class Laporan {
  // CREATE
  static async create({ id_jadwal, status_lokasi, keterangan, gambar1, gambar2, gambar3, gambar4 }) {
    return knex('laporan').insert({
      id_jadwal,
      status_lokasi,
      keterangan,
      gambar1,
      gambar2,
      gambar3,
      gambar4
    });
  }

  // CEK apakah satpam sesuai dengan jadwal
  static async checkSatpamByJadwal(id_jadwal, nama, nip) {
    const data = await knex('jadwal_jaga as j')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .where('j.id', id_jadwal)
      .select('s.id as id_satpam', 's.nama as nama_satpam', 's.nip as nip_satpam')
      .first();

    if (!data) {
      return { valid: false, message: 'Data jadwal tidak ditemukan' };
    }

    if (data.nama_satpam !== nama || data.nip_satpam !== nip) {
      return { valid: false, message: 'Satpam tidak sesuai dengan jadwal jaga' };
    }

    return { valid: true, satpam: data };
  }

  // READ ALL — join agar bisa tampilkan nama, nip satpam & nama, kode pos
  static async getAll() {
    return knex('laporan as l')
      .join('jadwal_jaga as j', 'l.id_jadwal', 'j.id')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .select(
        'l.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'l.status_lokasi',
        'l.keterangan',
        'l.gambar1',
        'l.gambar2',
        'l.gambar3',
        'l.gambar4',
        'l.created_at'
      )
      .orderBy('l.created_at', 'desc');
  }

  // READ BY ID — ambil laporan berdasarkan ID, plus info satpam & pos lengkap
  static async getById(id) {
    return knex('laporan as l')
      .join('jadwal_jaga as j', 'l.id_jadwal', 'j.id')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .where('l.id', id)
      .select(
        'l.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'l.status_lokasi',
        'l.keterangan',
        'l.gambar1',
        'l.gambar2',
        'l.gambar3',
        'l.gambar4',
        'l.created_at'
      )
      .first();
  }

  // UPDATE
  static async update(id, data) {
    return knex('laporan').where({ id }).update(data);
  }

  // DELETE
  static async delete(id) {
    return knex('laporan').where({ id }).del();
  }
}

module.exports = Laporan;
