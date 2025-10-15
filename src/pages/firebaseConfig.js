// ============================================
// Firebase Configuration
// Location: src/pages/firebaseConfig.js
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMIjCf_2kC8sCHogeEFqVaaDK4FWkfuVk",
  authDomain: "sahaaya-web-d0b1d.firebaseapp.com",
  projectId: "sahaaya-web-d0b1d",
  storageBucket: "sahaaya-web-d0b1d.firebasestorage.app",
  messagingSenderId: "810565957799",
  appId: "1:810565957799:web:839b8600aa2fddb3408382",
  measurementId: "G-7EYJFGF66F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;