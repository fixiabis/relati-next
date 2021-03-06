import firebaseAdmin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string);

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://relati.firebaseio.com"
  });
}

export default firebaseAdmin;
