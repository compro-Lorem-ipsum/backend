const admin = require("firebase-admin");

// Ambil raw value dari Azure / GitHub Secrets
let rawKey = process.env.FIREBASE_PRIVATE_KEY;


rawKey = rawKey.replace(/\\n/g, '\n');

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
