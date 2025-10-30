const { knex } = require('../config/db');

class Admin {
    // CREATE (buat akun baru)
    static async create({ nama, username, password, role = 'Admin' }) {
        return knex('admin').insert({
            nama,
            username,
            password,
            role
        });
    }

    // READ (ambil semua admin)
    static async getAll() {
        return knex('admin')
            .select('id', 'nama', 'username', 'role', 'created_at')
            .orderBy('created_at', 'desc');
    }

    // READ by username
    static async findByUsername(username) {
        return knex('admin')
            .where({ username })
            .first();
    }

    // READ by id
    static async findById(id) {
        return knex('admin')
            .where({ id })
            .select('id', 'nama', 'username', 'role', 'created_at')
            .first();
    }

    // UPDATE (ubah nama, password, atau role)
    static async update(id, data) {
        return knex('admin')
            .where({ id })
            .update(data);
    }

    // DELETE (hapus admin, kecuali SuperAdmin)
    static async delete(id) {
        return knex('admin')
            .where({ id })
            .andWhereNot({ role: 'SuperAdmin' }) // cegah hapus SuperAdmin
            .del();
    }
}

module.exports = Admin;
