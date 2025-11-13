const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.project_id + ".firebasestorage.app"
});

const bucket = admin.storage().bucket();
module.exports = bucket;