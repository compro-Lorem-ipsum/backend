const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

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
app.use("/uploads", express.static("uploads"));

// Jalankan server
app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});
