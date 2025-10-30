const { knex } = require('../config/db');

class Jadwal {
  // CREATE
  static async create({ id_satpam, id_pos, tanggal, jam_mulai, jam_selesai }) {
    return knex('jadwal_jaga').insert({
      id_satpam,
      id_pos,
      tanggal,
      jam_mulai,
      jam_selesai
    });
  }

  // READ ALL
  static async getAll() {
    return knex('jadwal_jaga as j')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .select(
        'j.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'j.jam_mulai',
        'j.jam_selesai'
      )
      .orderBy('j.tanggal', 'desc')
      .orderBy('j.jam_mulai', 'asc');
  }


  // READ BY ID
  static async getById(id) {
    return knex('jadwal_jaga as j')
      .join('satpam as s', 'j.id_satpam', 's.id')
      .join('pos as p', 'j.id_pos', 'p.id')
      .where('j.id', id)
      .select(
        'j.id',
        's.nama as nama_satpam',
        's.nip as nip_satpam',
        'p.kode_pos',
        'p.nama_pos',
        'j.tanggal',
        'j.jam_mulai',
        'j.jam_selesai'
      )
      .first();
  }

  // CEK apakah satpam sudah punya jadwal bentrok di tanggal & jam yang sama
  static async checkConflict({ id_satpam, tanggal, jam_mulai, jam_selesai, excludeId = null }) {
    const query = knex('jadwal_jaga')
      .where('id_satpam', id_satpam)
      .andWhere('tanggal', tanggal)
      .andWhere(function () {
        // Bentrok jika waktu mulai/sampai tumpang tindih dengan jadwal lain
        this.whereBetween('jam_mulai', [jam_mulai, jam_selesai])
          .orWhereBetween('jam_selesai', [jam_mulai, jam_selesai])
          .orWhere(function () {
            this.where('jam_mulai', '<=', jam_mulai).andWhere('jam_selesai', '>=', jam_selesai);
          });
      });

    if (excludeId) {
      query.andWhereNot('id', excludeId);
    }

    const existing = await query.first();
    return !!existing; // true jika bentrok
  }

  // UPDATE
  static async update(id, { id_satpam, id_pos, tanggal, jam_mulai, jam_selesai }) {
    return knex('jadwal_jaga')
      .where({ id })
      .update({ id_satpam, id_pos, tanggal, jam_mulai, jam_selesai });
  }

  // DELETE
  static async delete(id) {
    return knex('jadwal_jaga').where({ id }).del();
  }
}

module.exports = Jadwal;
