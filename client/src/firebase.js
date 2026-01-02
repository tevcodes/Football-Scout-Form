import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc12345"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 3. Connect Emulators (Only on localhost and if not already connected)
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  
  try {

    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    

    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    
    console.log("✅ Connected to Firebase Emulators");
  } catch (e) {
    console.warn("Emulators might already be connected, skipping...");
  }
}

export { auth, db, storage };