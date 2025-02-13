import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBacRmWSWcJsNfKVUWV1oWqOcWq677U0-Y",
  authDomain: "giftapplication-a6646.firebaseapp.com",
  projectId: "giftapplication-a6646",
  storageBucket: "giftapplication-a6646.firebasestorage.app",
  messagingSenderId: "734408771673",
  appId: "1:734408771673:web:eb5b9d9ac02c19a743c948",
  measurementId: "G-BHKZZECFKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, signInWithEmailAndPassword, signOut, db , storage};
