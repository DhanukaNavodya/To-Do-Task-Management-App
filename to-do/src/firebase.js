// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc ,updateDoc,query,where  } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZrY0W_lszNwy25VTjzgAItwRoixG-fAY",
  authDomain: "to-do-app-14e10.firebaseapp.com",
  projectId: "to-do-app-14e10",
  storageBucket: "to-do-app-14e10.firebasestorage.app",
  messagingSenderId: "1024207391785",
  appId: "1:1024207391785:web:c25eab7fcf55f2e548e038",
  measurementId: "G-9SK3E8PMM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get Firestore instance
export { db, collection, addDoc, getDocs, deleteDoc, doc,updateDoc,query,where  };
