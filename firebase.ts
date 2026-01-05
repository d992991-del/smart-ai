
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseConfigStr = process.env.FIREBASE_CONFIG;

if (firebaseConfigStr) {
  try {
    const config = JSON.parse(firebaseConfigStr);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully in Formal Mode");
  } catch (error) {
    console.error("Failed to parse FIREBASE_CONFIG, falling back to Demo Mode", error);
  }
} else {
  console.warn("FIREBASE_CONFIG not found, application will run in Demo Mode (Local Storage)");
}

export { auth, db };
export const isFirebaseEnabled = () => auth !== null && db !== null;
