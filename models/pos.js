const { knex } = require('../config/db');

class Pos {
  // CREATE
  static async create({ kode_pos, nama_pos, latitude, longitude }) {
    return knex('pos').insert({
      kode_pos,
      nama_pos,
      latitude,
      longitude
    });
  }

  // READ ALL
  static async getAll() {
    return knex('pos')
      .select('id', 'kode_pos', 'nama_pos', 'latitude', 'longitude', 'created_at')
      .orderBy('id', 'asc');
  }

  // READ BY ID
  static async getById(id) {
    return knex('pos')
      .where({ id })
      .select('id', 'kode_pos', 'nama_pos', 'latitude', 'longitude', 'created_at')
      .first();
  }

  // UPDATE
  static async update(id, { kode_pos, nama_pos, latitude, longitude }) {
    return knex('pos')
      .where({ id })
      .update({
        ...(kode_pos && { kode_pos }),
        ...(nama_pos && { nama_pos }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude })
      });
  }

  // DELETE
  static async delete(id) {
    return knex('pos').where({ id }).del();
  }
}

module.exports = Pos;
