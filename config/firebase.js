const admin = require("firebase-admin");

// Ambil raw value dari Azure / GitHub Secrets
let rawKey = process.env.FIREBASE_PRIVATE_KEY;

const decodedKey = Buffer.from(rawKey, "base64").toString("utf-8");

console.log("RAW KEY (first 50 chars):", rawKey?.substring(0, 50));
console.log("DECODED KEY (first 100 chars):", decodedKey?.substring(0, 100));
console.log("DECODED KEY starts with BEGIN?:", decodedKey?.startsWith("-----BEGIN"));
console.log("DECODED KEY length:", decodedKey?.length);

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: decodedKey,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const bucket = admin.storage().bucket();
module.exports = bucket;
