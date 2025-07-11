import { getApps, initializeApp } from 'firebase/app';

// Optionally import the services that you want to use

//import {...} from 'firebase/database';
//import { getAuth } from 'firebase/auth';
import {
  getAuth
} from 'firebase/auth';
//import { getReactNativePersistence } from 'firebase/auth/react-native';

import { getFirestore } from 'firebase/firestore';
// import {...} from 'firebase/functions';
//import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
 apiKey: "AIzaSyAKY3nvEo29XzcBN0x9DRlejZmLLBYbHsE",
  authDomain: "emhere-2025.firebaseapp.com",
  projectId: "emhere-2025",
  storageBucket: "emhere-2025.firebasestorage.app",
  messagingSenderId: "909981773271",
  appId: "1:909981773271:web:9d63f80ec2262121d8af92",
  measurementId: "G-YY8KT61BWM",
  //databaseURL: 'https://emhere-2025.firebaseio.com',

 
  
 
  
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export { auth, db };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
