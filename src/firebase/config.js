import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  // Paste Your keys here
  apiKey: "AIzaSyBRUsrjreVhvRqmRYEkI9MCIbkqnlwVc_c",
  authDomain: "agendadigital-54135.firebaseapp.com",
  projectId: "agendadigital-54135",
  storageBucket: "agendadigital-54135.appspot.com",
  messagingSenderId: "937439472826",
  appId: "1:937439472826:web:81227dbc2e207410526683",
  measurementId: "G-VPPC33W0WK",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
