import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use

//import {...} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import {...} from 'firebase/functions';
//import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'emhere-2025.firebaseapp.com',
  databaseURL: 'https://emhere-2025.firebaseio.com',
  projectId: 'emhere-2025',
  storageBucket: 'emhere-2025.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
