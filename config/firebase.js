const admin = require("firebase-admin");

// Ambil raw value dari Azure / GitHub Secrets
let rawKey = process.env.FIREBASE_PRIVATE_KEY;

const decodedKey = Buffer.from(rawKey, "base64").toString("utf-8");

// LOG DEBUG
console.log("=== DEBUG FIREBASE KEY ===");
console.log("RAW KEY (first 50 chars):", rawKey?.substring(0, 50));
console.log("DECODED KEY (first 100 chars):", decodedKey?.substring(0, 100));
console.log("DECODED KEY starts with BEGIN?:", decodedKey?.startsWith("-----BEGIN"));
console.log("DECODED KEY length:", decodedKey?.length);
console.log("DECODED JSON.stringify:", JSON.stringify(decodedKey));
console.log("==========================");

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: decodedKey,
    }),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
} catch (e) {
  console.error("FIREBASE INIT ERROR:", e);
}

const bucket = admin.storage().bucket();
module.exports = bucket;
