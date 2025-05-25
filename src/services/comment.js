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

    const q = query(chatRef, where('reviewId', '==', reviewId), limit(1));

    const chatSnapshot = await getDocs(q);

    let chatDoc;

    if (chatSnapshot.empty) {
        chatDoc = await addDoc(chatRef, {
            reviewId: reviewId,
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
        // In theory, the Snapshot mapping is an array of promises
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

// To update comments when editing them
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
            throw new Error("reviewId or commentId is invalid.");
        }

        const chatDoc = await getChatCommentDoc(reviewId);

        if (!chatDoc || !chatDoc.id) {
            throw new Error(`Chat document with reviewId: ${reviewId} not found`);
        }

        const commentRef = doc(db, `comments/${chatDoc.id}/actualComments`, commentId);
        await deleteDoc(commentRef);
        // console.log(`Comment ${commentId} successfully deleted.`);
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
}

export async function deleteAllComments(reviewId) {
    try {
        const chatDoc = await getChatCommentDoc(reviewId);
        if (!chatDoc || !chatDoc.id) {
            throw new Error(`Comment document not found for reviewId: ${reviewId}`);
        }

        // Get all comments within actualComments
        const commentsRef = collection(db, `comments/${chatDoc.id}/actualComments`);
        const commentsSnapshot = await getDocs(commentsRef);

        // Delete all documents within currentComments
        const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
            deleteDoc(doc(db, `comments/${chatDoc.id}/actualComments/${commentDoc.id}`))
        );
        await Promise.all(deletePromises);

        // Finally, delete the comments document
        await deleteDoc(doc(db, `comments/${chatDoc.id}`));

        console.log(`All comments and the comments document for reviewId: ${reviewId} have been deleted.`);
        return true;
    } catch (error) {
        console.error("Error deleting all comments:", error);
        return false;
    }
}

