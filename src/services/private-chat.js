import { addDoc, collection, getDocs, query, serverTimestamp, where, DocumentReference, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "./firebase";

let chatDocsCache = {};

/**
 * Returns the key for the cache that corresponds to the ids provided as arguments.
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string}
 */

function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join("_");
}

/**
 * 
 * @param {string} key 
 * @returns {string|null}
 */
function getPrivateChatDocFromCache(key) {
    return chatDocsCache[key] || null;
}


/**
 * 
 * @param {string} key 
 * @param {any} doc
 */
function addPrivateChatDocToCache(key, doc) {
    chatDocsCache[key] = doc;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getPrivateChatDoc(senderId, receiverId) {

    const cacheKey = getCacheKey(senderId, receiverId);
    const cachedDoc = getPrivateChatDocFromCache(cacheKey);

    if (cachedDoc) return cachedDoc;

    const chatRef = collection(db, 'private-chats');

    const q = query(chatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }), limit(1));

    const chatSnapshot = await getDocs(q);
    let chatDoc;

    if (chatSnapshot.empty) {
        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            }
        });
    } else {
        chatDoc = chatSnapshot.docs[0];
    }

    addPrivateChatDocToCache(cacheKey, chatDoc);

    return chatDoc;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    // Para poder grabar el mensaje, primero necesitamos tener la el id documento del chat privado.
    // Ya sea porque lo creamos si no existe, o usando el id del que ya exista.
    const chatDoc = await getPrivateChatDoc(senderId, receiverId);

    // Ahora que tenemos el documento del chat, y por extensión, el id que le corresponde, podemos proceder a grabar
    // el mensaje en la subcollection de mensajes.
    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
}


/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @returns {import("firebase/firestore").Unsubscribe}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const chatDoc = await getPrivateChatDoc(senderId, receiverId);
    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    const messagesQuery = query(messagesRef, orderBy('created_at'));

    return onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(messages);
    });
}