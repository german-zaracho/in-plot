import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * 
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