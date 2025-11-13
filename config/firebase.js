const admin = require("firebase-admin");

// Ambil raw value dari Azure / GitHub Secrets
let rawKey = process.env.FIREBASE_PRIVATE_KEY;

if (!rawKey) {
  console.error("❌ FIREBASE_PRIVATE_KEY UNDEFINED at firebase.js load time");
  rawKey = "";
}

rawKey = rawKey.replace(/\\n/g, '\n');

// Jika BASE64 → decode ke PEM
if (rawKey && !rawKey.includes("BEGIN PRIVATE KEY")) {
  try {
    rawKey = Buffer.from(rawKey, "base64").toString("utf8");
  } catch (e) {
    console.error("Gagal decode BASE64 private key:", e);
  }
}

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: rawKey,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const bucket = admin.storage().bucket();
module.exports = bucket;
