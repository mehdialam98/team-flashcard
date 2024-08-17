// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirebase } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEbiWnsvZh14WXaRt9UhxuR4jSdWYETPw",
  authDomain: "flashcard-e1c97.firebaseapp.com",
  projectId: "flashcard-e1c97",
  storageBucket: "flashcard-e1c97.appspot.com",
  messagingSenderId: "48747792241",
  appId: "1:48747792241:web:1da60fe03648511e6998d0",
  measurementId: "G-PMWLSZ17NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db}