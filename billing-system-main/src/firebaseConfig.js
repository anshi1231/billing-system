// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMgn7pskjAQ8_q91Fo1qjrXCiKgbJ97_E",
  authDomain: "barcode-system-ee10c.firebaseapp.com",
  projectId: "barcode-system-ee10c",
  storageBucket: "barcode-system-ee10c.firebasestorage.app",
  messagingSenderId: "300384075014",
  appId: "1:300384075014:web:a20838a050a4b0e953b287",
  measurementId: "G-D7TE618DGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Export Firestore database instance
export const db = getFirestore(app);