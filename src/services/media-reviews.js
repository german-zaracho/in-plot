import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param { string } id 
 * @param {{ title: string, synopsis: string, trailer: string, year: string }} data 
 */
export async function createNewReview(id, {title, synopsis, trailer, year}) {
    const reviewRef = collection(db, `media-reviews`);
    
    await addDoc(reviewRef, {
        user_id: id,
        title,
        synopsis,
        trailer,
        year,
        created_at: serverTimestamp(),
    });
}

