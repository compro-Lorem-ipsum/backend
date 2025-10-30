const { knex } = require('../config/db');

class Absensi {
  // CREATE (check-in atau check-out)
  static async create({ id_jadwal, tipe, waktu_absen, status }) {
    return knex('absensi').insert({
      id_jadwal,
      tipe,
      waktu_absen,
      status
    });
  }

  // CHECK — Cek apakah satpam cocok dengan jadwal
  static async checkSatpamByJadwal(id_jadwal, nama, nip) {
    const data = await knex('jadwal_jaga as j')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .where('j.id', id_jadwal)
      .select('s.id as id_satpam', 's.nama as nama_satpam', 's.nip as nip_satpam')
      .first();

    if (!data) {
      return { valid: false, message: 'Jadwal tidak ditemukan' };
    }

    if (data.nama_satpam !== nama || data.nip_satpam !== nip) {
      return { valid: false, message: 'Satpam tidak cocok dengan jadwal' };
    }

    return { valid: true, satpam: data };
  }

  // READ ALL — Gabungkan dengan jadwal, satpam, dan pos
  static async getAll() {
    return knex('absensi as a')
      .join('jadwal_jaga as j', 'a.id_jadwal', 'j.id')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .select(
        'a.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'j.jam_mulai',
        'j.jam_selesai',
        'a.tipe',
        'a.waktu_absen',
        'a.status',
        'a.created_at'
      )
      .orderBy('a.created_at', 'desc');
  }

  // READ BY ID — Detail absensi berdasarkan ID
  static async getById(id) {
    return knex('absensi as a')
      .join('jadwal_jaga as j', 'a.id_jadwal', 'j.id')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .where('a.id', id)
      .select(
        'a.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'j.jam_mulai',
        'j.jam_selesai',
        'a.tipe',
        'a.waktu_absen',
        'a.status',
        'a.created_at'
      )
      .first();
  }

  // UPDATE — Ubah waktu_absen atau status
  static async update(id, data) {
    return knex('absensi').where({ id }).update(data);
  }

  // DELETE
  static async delete(id) {
    return knex('absensi').where({ id }).del();
  }
}

module.exports = Absensi;
