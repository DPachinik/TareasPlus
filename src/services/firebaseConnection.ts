
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR1Q8WKEzjhN7Q_ns-mhhRR5GZqPL8vXM",
  authDomain: "tareasplus-a9757.firebaseapp.com",
  projectId: "tareasplus-a9757",
  storageBucket: "tareasplus-a9757.firebasestorage.app",
  messagingSenderId: "605120984777",
  appId: "1:605120984777:web:ad30869ecf480101efff18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const  db = getFirestore(app);

export {db} ;