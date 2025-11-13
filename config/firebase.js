const admin = require("firebase-admin");

// Decode private key BASE64 menjadi teks asli PEM
const privateKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY,
  "base64"
).toString("utf8");

// Buat service account object
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: privateKey,
};

// Initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

// Export bucket
const bucket = admin.storage().bucket();
module.exports = bucket;
