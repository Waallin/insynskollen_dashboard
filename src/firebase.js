// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIDtv1PoLhGFTXE5HLZbMXcmB3MBFlefE",
  authDomain: "devember-20f2e.firebaseapp.com",
  projectId: "devember-20f2e",
  storageBucket: "devember-20f2e.appspot.com",
  messagingSenderId: "199570882781",
  appId: "1:199570882781:web:836a07ec5ffcbd8d1d9b34",
  measurementId: "G-DN61FSJHGM",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const database = getFirestore();
