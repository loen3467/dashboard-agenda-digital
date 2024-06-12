// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRUsrjreVhvRqmRYEkI9MCIbkqnlwVc_c",
  authDomain: "agendadigital-54135.firebaseapp.com",
  projectId: "agendadigital-54135",
  storageBucket: "agendadigital-54135.appspot.com",
  messagingSenderId: "937439472826",
  appId: "1:937439472826:web:81227dbc2e207410526683",
  measurementId: "G-VPPC33W0WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
