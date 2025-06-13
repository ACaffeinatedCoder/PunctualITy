// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-gHQpeM4ldm26itxs9d72v8eml06gkW0",
  authDomain: "punctuality-78586.firebaseapp.com",
  projectId: "punctuality-78586",
  storageBucket: "punctuality-78586.firebasestorage.app",
  messagingSenderId: "872337352089",
  appId: "1:872337352089:web:58b3c18366bf9bbb509f08",
  measurementId: "G-W7NWJEN1DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);