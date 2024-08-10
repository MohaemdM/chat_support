// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAcEvi1nEZfeYv0zRqt6PEQu7DyvezgAgA",
  authDomain: "chat-support-cabc4.firebaseapp.com",
  projectId: "chat-support-cabc4",
  storageBucket: "chat-support-cabc4.appspot.com",
  messagingSenderId: "78091973802",
  appId: "1:78091973802:web:7ffcc5057be0e39c3c0cd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
