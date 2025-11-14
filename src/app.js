const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5500;

// ==========================
// 1. Tentukan ROOT PROJECT
// ==========================
// __dirname sekarang adalah: /project/src
// maka rootPath = /project
const rootPath = path.join(__dirname, '..');

// ==========================
// 2. Tentukan folder uploads di ROOT
// ==========================
const uploadPath = path.join(rootPath, 'uploads');

// ==========================
// 3. Serve static file uploads
// ==========================
app.use('/uploads', express.static(uploadPath));
console.log("Serving uploads from:", uploadPath);

// ==========================
// 4. Middleware
// ==========================
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// 5. Routes
// ==========================
const adminRoute = require('../route/adminRoute');
const satpamRoute = require('../route/satpamRoute');
const jadwalRoute = require('../route/jadwalRoute');
const posRoute = require('../route/posRoute');
const laporanRoute = require('../route/laporanRoute');
const absensiRoute = require('../route/absensiRoute');

app.use('/api/auth', adminRoute);
app.use('/api/satpam', satpamRoute);
app.use('/api/jadwal', jadwalRoute);
app.use('/api/pos', posRoute);
app.use('/api/laporan', laporanRoute);
app.use('/api/absensi', absensiRoute);

// ==========================
// 6. Start server
// ==========================
app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});
