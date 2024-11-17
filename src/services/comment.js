import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {{id: string, email: string, text: string}} newComment 
 * @returns {Promise<void>}
 */

export async function saveChatComment(newComment) {

    const commentRef = collection(db, 'comments');

    await addDoc(commentRef, {
        ...newComment,
        created_at: serverTimestamp(),
    });

}

/**
 * 
 * @param {(comments: []{}) => void} callback 
 */

export function subscribeToChatComments(callback) {

    const commentRef = collection(db, 'comments');
    const commentQuery = query(commentRef, orderBy('created_at'));

    onSnapshot(commentQuery, snapshot => {

        const comments = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                email: doc.data().email,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(comments);

    });
}
