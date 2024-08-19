// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//for testing use your own firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALGXV9G3YLQnFr4ke8WQ85muMspN-OBnU",
  authDomain: "flashcards-ff0a6.firebaseapp.com",
  projectId: "flashcards-ff0a6",
  storageBucket: "flashcards-ff0a6.appspot.com",
  messagingSenderId: "588732265077",
  appId: "1:588732265077:web:db9a75c1ad13143624be3c",
  measurementId: "G-C1HW7Y2ZDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db, collection, getDoc, doc };

