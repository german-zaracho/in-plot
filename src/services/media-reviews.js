import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param { string } id 
 * @param {{ title: string, synopsis: string, trailer: string, year: string, coverURL: string }} data 
 */
export async function createNewReview(id, {title, synopsis, trailer, year, coverURL}) {

    
    const reviewRef = collection(db, `media-reviews`);
    
    await addDoc(reviewRef, {
        user_id: id,
        title,
        synopsis,
        trailer,
        year,
        coverURL,
        created_at: serverTimestamp(),
    });
}


export async function getAllReviews() {
    const reviewsCollection = collection(db, "media-reviews");
    const reviewsSnapshot = await getDocs(reviewsCollection);

    return reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}
