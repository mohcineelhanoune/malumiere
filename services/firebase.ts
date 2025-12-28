
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDeDSEtl2g4MDJjrXpDbtRE_jc1feQwNlM",
  authDomain: "shopcard-76189.firebaseapp.com",
  projectId: "shopcard-76189",
  storageBucket: "shopcard-76189.firebasestorage.app",
  messagingSenderId: "64193230928",
  appId: "1:64193230928:web:72c13767870a37a82bb955"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
