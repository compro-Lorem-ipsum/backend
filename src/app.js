if (process.env.WEBSITE_SITE_NAME === undefined) {
  // only load .env locally
  require("dotenv").config();
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route autentikasi
const adminRoute = require('../route/adminRoute');
const satpamRoute = require('../route/satpamRoute');
const jadwalRoute = require('../route/jadwalRoute');
const posRoute = require('../route/posRoute');
const laporanRoute = require('../route/laporanRoute');
const absensiRoute = require('../route/absensiRoute');

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Route utama untuk autentikasi admin/superadmin
app.use('/api/auth', adminRoute);
app.use('/api/satpam', satpamRoute);
app.use('/api/jadwal', jadwalRoute);
app.use('/api/pos', posRoute);
app.use('/api/laporan', laporanRoute);
app.use('/api/absensi', absensiRoute);

console.log("ENV DEBUG:");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "EXISTS" : "UNDEFINED");

// Jalankan server
app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});
