import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {

    const chatRef = collection(db, 'private-chats');

    const q = query(chatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }));

    const chatSnapshot = await getDocs(q);
    let chatDoc;

    if(chatSnapshot.empty) {

        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            }
        });
    } else {
        chatDoc = chatSnapshot.docs[0];
    }

    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });

}

// export async function subscribeToPrivateChatMessages() {

// }