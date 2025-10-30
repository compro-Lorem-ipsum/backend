const mysql = require('mysql2');
const knex = require('knex');
require('dotenv').config();

// Koneksi MySQL 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Gagal terkoneksi ke database:', err.message);
  } else {
    console.log('Terkoneksi ke Database (mysql2)');
  }
});

// Koneksi Knex.js
const knexInstance = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  pool: { min: 0, max: 10 }
});

// Export 
module.exports = {
  connection,
  knex: knexInstance
};
