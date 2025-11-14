const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Path ke root project (naik 2 folder dari /controller/satpam)
const rootPath = path.join(__dirname, "..");

// Path ke folder uploads di root project
const uploadPath = path.join(rootPath, "uploads");

// Pastikan folder uploads ada
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("Folder uploads dibuat (multer):", uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
