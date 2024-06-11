import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  // Paste Your keys here
  apiKey: "AIzaSyCF34MaLq1eQ_CysZXYAcZvQP7lx5hmha8",
  authDomain: "fir-login-react-d903f.firebaseapp.com",
  projectId: "fir-login-react-d903f",
  storageBucket: "fir-login-react-d903f.appspot.com",
  messagingSenderId: "861977673053",
  appId: "1:861977673053:web:9c0bf721b0051d9de93cb4",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
