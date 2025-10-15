// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4ucOk0C2emiVKs69o8KpPO_LkefuWomk",
  authDomain: "projectinsider-25e5d.firebaseapp.com",
  projectId: "projectinsider-25e5d",
  storageBucket: "projectinsider-25e5d.appspot.com",
  messagingSenderId: "833888929698",
  appId: "1:833888929698:web:b8c2c4e06d8119c5ba94fb",
  measurementId: "G-TC16EC5T5W",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const database = getFirestore();
