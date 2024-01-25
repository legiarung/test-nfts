// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXlX3aFFc13wGHplSwQ8El-ZPI61Iw1fE",
  authDomain: "save-3d5f2.firebaseapp.com",
  projectId: "save-3d5f2",
  storageBucket: "save-3d5f2.appspot.com",
  messagingSenderId: "283124808499",
  appId: "1:283124808499:web:216fa8c34ca3e20c885c46",
  measurementId: "G-2NP6P9PNMX"
};

// Initialize Firebase
const appStore = initializeApp(firebaseConfig);
const analytics = getAnalytics(appStore);
export default appStore