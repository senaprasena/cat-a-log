// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSKpg8CBRMBmGgmvfnm565DINsLiiXyrY",
  authDomain: "cat-a-log-168.firebaseapp.com",
  projectId: "cat-a-log-168",
  storageBucket: "cat-a-log-168.firebasestorage.app",
  messagingSenderId: "185363501633",
  appId: "1:185363501633:web:d65569487953e7dd192cc0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
