import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, getDocs, where, DocumentReference, limit } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * 
 * @param {string} reviewId
 * @returns {Promise<DocumentReference>}
 */
// Consigue el chat de comentarios si es que existe, sino lo crea, y luego pasa la id de la collection
async function getChatCommentDoc(reviewId) {

    const chatRef = collection(db, 'comments');

    const q = query(chatRef, where('reviewId', '==', {[reviewId]: true,}), limit(1));

    const chatSnapshot = await getDocs(q);
    let chatDoc;

    if (chatSnapshot.empty) {
        chatDoc = await addDoc(chatRef, {
            reviewId: {
                [reviewId]: true,
            }
        });
    } else {
        chatDoc = chatSnapshot.docs[0];
    }

    return chatDoc;
}

/**
 * 
 * @param {string} userId 
 * @param {string} reviewId 
 * @param {string} text 
 */
// se conecta con la collection y se guarda el mensaje comentario nuevo
export async function saveChatComment(reviewId, newComment) {

    const chatDoc = await getChatCommentDoc(reviewId);

    const commentsRef = collection(db, `comments/${chatDoc.id}/actualComments`);

    await addDoc(commentsRef, {
        user_id: newComment.user_id,
        email: newComment.email,
        text: newComment.text,
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {string} reviewId 
 * @param {Function} callback 
 * @returns {import("firebase/firestore").Unsubscribe}
 */

// consigue los mensajes actualizados y los pasa
export async function subscribeToReviewComments(reviewId, callback) {
    const chatDoc = await getChatCommentDoc(reviewId);
    console.log('el id que tengo que verificar',chatDoc.id);
    const commentsRef = collection(db, `comments/${chatDoc.id}/actualComments`);

    const commentsQuery = query(commentsRef, orderBy('created_at'));

    return onSnapshot(commentsQuery, snapshot => {
        const comments = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                email: doc.data().email,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });
        console.log('Comments updated in Firestore:', comments);
        callback([...comments]);
    });
}
