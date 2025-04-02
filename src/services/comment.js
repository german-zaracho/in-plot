import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, getDocs, doc, getDoc, where, DocumentReference, limit, updateDoc, deleteDoc } from "firebase/firestore";
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

    const q = query(chatRef, where('reviewId', '==', { [reviewId]: true, }), limit(1));

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
    // console.log('id that i have to verify',chatDoc.id);
    const commentsRef = collection(db, `comments/${chatDoc.id}/actualComments`);

    const commentsQuery = query(commentsRef, orderBy('created_at'));

    return onSnapshot(commentsQuery, async (snapshot) => {
        // changes "Promise.all" no coherence
        const comments = await Promise.all(
            snapshot.docs.map(async (doc) => {

                const commentData = doc.data();

                const userProfileRef = collection(db, `user-profiles`);
                const userQuery = query(userProfileRef, where('email', '==', commentData.email), limit(1));
                const userProfileSnap = await getDocs(userQuery);

                // console.log('passing userProfileSnap', userProfileSnap);

                let displayName = null;

                if (!userProfileSnap.empty) {
                    const userProfileDoc = userProfileSnap.docs[0];
                    displayName = userProfileDoc.data().displayName || null;
                }

                // console.log('passing displayName', displayName);

                return {
                    id: doc.id,
                    user_id: commentData.user_id,
                    email: commentData.email,
                    text: commentData.text,
                    created_at: commentData.created_at?.toDate(),
                    displayName,
                };
            })
        );

        // console.log('comments updated in Firestore:', comments);
        callback([...comments]);
    });

}

//new para actualizar los comentarios al editarlos
/**
 * 
 * @param {string} reviewId 
 * @param {string} commentId 
 * @param {string} newText 
 */
export async function updateChatComment(reviewId, commentId, newText) {
    const chatDoc = await getChatCommentDoc(reviewId);
    const commentRef = doc(db, `comments/${chatDoc.id}/actualComments`, commentId);

    await updateDoc(commentRef, {
        text: newText
    });
}

export async function deleteChatComment(reviewId, commentId) {
    try {

        if (!reviewId || !commentId) {
            throw new Error("reviewId o commentId es inválido.");
        }

        const chatDoc = await getChatCommentDoc(reviewId);

        if (!chatDoc || !chatDoc.id) {
            throw new Error("No se encontró el documento del chat con reviewId: ${reviewId}");
        }

        const commentRef = doc(db, `comments/${chatDoc.id}/actualComments`, commentId);
        await deleteDoc(commentRef);
        console.log(`Comentario ${commentId} eliminado correctamente.`);
    } catch (error) {
        console.error("Error eliminando el comentario:", error);
    }
}

export async function deleteAllComments(reviewId) {
    try {
        const chatDoc = await getChatCommentDoc(reviewId);
        if (!chatDoc || !chatDoc.id) {
            throw new Error(`No se encontró el documento de comentarios para reviewId: ${reviewId}`);
        }

        // Obtener todos los comentarios dentro de actualComments
        const commentsRef = collection(db, `comments/${chatDoc.id}/actualComments`);
        const commentsSnapshot = await getDocs(commentsRef);

        // Eliminar todos los documentos dentro de actualComments
        const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
            deleteDoc(doc(db, `comments/${chatDoc.id}/actualComments/${commentDoc.id}`))
        );
        await Promise.all(deletePromises);

        // Finalmente, eliminar el documento de comentarios
        await deleteDoc(doc(db, `comments/${chatDoc.id}`));

        console.log(`Todos los comentarios y el documento de comentarios de reviewId: ${reviewId} han sido eliminados.`);
        return true;
    } catch (error) {
        console.error("Error eliminando todos los comentarios:", error);
        return false;
    }
}

