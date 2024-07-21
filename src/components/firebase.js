// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGD41f7YT-UQyGZ7d1GzzB19B9wDNbg58",
  authDomain: "guestbook-73dfc.firebaseapp.com",
  databaseURL: "https://guestbook-73dfc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "guestbook-73dfc",
  storageBucket: "guestbook-73dfc.appspot.com",
  messagingSenderId: "674344514507",
  appId: "1:674344514507:web:fc587317fa516369a3bc4e",
  measurementId: "G-1TZ4B0BK9D"
};
const firebaseConfig2 = {
    apiKey: "AIzaSyAEUAgb7dUt7ZO8S5-B4P3p1fHMJ_LqdPc",
    authDomain: "polskibet-71ef6.firebaseapp.com",
    projectId: "polskibet-71ef6",
    storageBucket: "polskibet-71ef6.appspot.com",
    messagingSenderId: "185818867502",
    appId: "1:185818867502:web:b582993ede95b06f80bcbf",
    measurementId: "G-VRP9QW7LRN"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);