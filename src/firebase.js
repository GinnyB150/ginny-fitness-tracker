// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcePFd5fCQjKDYy1f60bJ4pt5DnedFH4w",
  authDomain: "ginnyfitnesstracker.firebaseapp.com",
  projectId: "ginnyfitnesstracker",
  storageBucket: "ginnyfitnesstracker.firebasestorage.app",
  messagingSenderId: "1005777495451",
  appId: "1:1005777495451:web:8e3bd54be36a365fa6ed3e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);