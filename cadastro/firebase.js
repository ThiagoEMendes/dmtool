// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyBjyWDtsSTa8Wb162xFujBt_q3KfKlOP98",
  authDomain: "dmtool-89d0d.firebaseapp.com",
  projectId: "dmtool-89d0d",
  storageBucket: "dmtool-89d0d.firebasestorage.app",
  messagingSenderId: "389362217807",
  appId: "1:389362217807:web:2805220ee73ce3c0c28b3a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
