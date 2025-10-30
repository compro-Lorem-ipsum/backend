CREATE DATABASE bima;

USE bima;
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'SuperAdmin') DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (nama, username, password, role)
VALUES 
('SuperAdmin', 'superadmin', '$2a$10$hVmUmdUXRgAnRJPaxbfFK./HhHXW8/En/LvuKckGi4gOFoafyj16i', 'SuperAdmin');

CREATE TABLE satpam (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    asal_daerah VARCHAR(150),
    nip VARCHAR(50) UNIQUE NOT NULL,
    no_telp VARCHAR(20),
    gambar VARCHAR(255),          -- path file di URL
    milvus_id CHAR(36),			-- ID dari Milvus Vector
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pos VARCHAR(50) NOT NULL, 
    nama_pos VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jadwal_jaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_satpam INT NOT NULL,
    id_pos INT NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,             -- contoh: '06:00:00'
    jam_selesai TIME NOT NULL,           -- contoh: '14:00:00'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_satpam) REFERENCES satpam(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pos) REFERENCES pos(id) ON DELETE CASCADE
);

CREATE TABLE absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_jadwal INT NOT NULL,
    tipe ENUM('check_in', 'check_out') NOT NULL,
    waktu_absen DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Tepat Waktu', 'Telat', 'Belum Absen') DEFAULT 'Belum Absen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jadwal) REFERENCES jadwal_jaga(id) ON DELETE CASCADE
);

CREATE TABLE laporan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_jadwal INT NOT NULL,
    status_lokasi ENUM('Aman', 'Tidak Aman') DEFAULT 'Aman',
    keterangan TEXT,
    gambar1 VARCHAR(255),
    gambar2 VARCHAR(255),
    gambar3 VARCHAR(255),
    gambar4 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jadwal) REFERENCES jadwal_jaga(id) ON DELETE CASCADE
);



