// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "bookverse-613cf.firebaseapp.com",
  projectId: "bookverse-613cf",
  storageBucket: "bookverse-613cf.firebasestorage.app",
  messagingSenderId: "454621983895",
  appId: "1:454621983895:web:0d9d9cf522c92600aba5d2",
  measurementId: "G-JTYN0HZ0P7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

