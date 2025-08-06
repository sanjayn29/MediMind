// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmi-uZ2GEt7vWBtffm5O9OoUyPU_LWZns",
  authDomain: "medicaldiagnosisai-92f3a.firebaseapp.com",
  projectId: "medicaldiagnosisai-92f3a",
  storageBucket: "medicaldiagnosisai-92f3a.firebasestorage.app",
  messagingSenderId: "3908127124",
  appId: "1:3908127124:web:f26928adefb51571c5a781",
  measurementId: "G-DH7LRYC52H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;