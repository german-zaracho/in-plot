import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, getDocs, where, DocumentReference, limit } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * 
 * @param {string} reviewId
 * @returns {Promise<DocumentReference>}
 */
// Get the comments chat if it exists, if not create it, and then pass the collection id
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
// Connects to the collection and saves the new comment
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

// Gets the updated comments and passes them
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
