// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);