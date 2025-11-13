const admin = require("firebase-admin");

// Private key dalam base64
const base64Key = process.env.FIREBASE_PRIVATE_KEY_BASE64;

// Decode Base64 → Buffer → String
const decodedKey = Buffer.from(base64Key, "base64").toString("utf-8");

// Buat service account object
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
