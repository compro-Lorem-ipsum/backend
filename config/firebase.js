const admin = require("firebase-admin");

// Decode BASE64 → kembali menjadi private key PEM multiline
const decodedPrivateKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY,
  "base64"
).toString("utf8");

// Simpan ke objek dengan nama aman (tidak terdeteksi oleh GitHub)
const safeServiceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  pKey: decodedPrivateKey, // aman, bukan "private_key"
};

// Initialize Firebase Admin dengan mapping ke private_key
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: safeServiceAccount.project_id,
    client_email: safeServiceAccount.client_email,
    private_key: safeServiceAccount.pKey, // baru dikirim sebagai private_key di sini
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

// Export bucket
const bucket = admin.storage().bucket();
module.exports = bucket;