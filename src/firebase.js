import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyChBo4SbtNLMkuk_hrAKFZkaQwRkfC8Q2E",
  authDomain: "beepeelabs.firebaseapp.com",
  projectId: "beepeelabs",
  storageBucket: "beepeelabs.firebasestorage.app",
  messagingSenderId: "892162385908",
  appId: "1:892162385908:web:107db4e9d002b9357c3ba1",
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
