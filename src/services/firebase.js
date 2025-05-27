import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param {string} path 
 * @param {File} file 
 */

export async function uploadFile(path, file) {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
}

/**
 * Returns the absolute URL with the location of the file on the server
 * 
 * @param {string} path 
 */

export async function getFileURL(path) {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
}