// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  connectStorageEmulator,
} from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  throw new Error("FIREBASE_API_KEY is not set");
}

const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
if (!FIREBASE_AUTH_DOMAIN) {
  throw new Error("FIREBASE_AUTH_DOMAIN is not set");
}

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
if (!FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID is not set");
}

const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
if (!FIREBASE_STORAGE_BUCKET) {
  throw new Error("FIREBASE_STORAGE_BUCKET is not set");
}

const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
if (!FIREBASE_MESSAGING_SENDER_ID) {
  throw new Error("FIREBASE_MESSAGING_SENDER_ID is not set");
}

const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;
if (!FIREBASE_APP_ID) {
  throw new Error("FIREBASE_APP_ID is not set");
}

const FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID;
if (!FIREBASE_MEASUREMENT_ID) {
  throw new Error("FIREBASE_MEASUREMENT_ID is not set");
}

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
const storage = getStorage();

export async function getFile(path: string): Promise<string> {
  const mediaRef = ref(storage, `gs://babbling-on-2023.appspot.com/${path}`);
  return await getDownloadURL(mediaRef);
}

export function useFirebaseEmulator() {
  connectAuthEmulator(auth, "127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
