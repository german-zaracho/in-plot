import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const NOTIFICATION_MESSAGES = {
    review: "Has posted a new review.",
    comment: "Has commented on your review.",
    like: "Liked your review",
    custom: "",
};

/**
 * Create a new notification
 * 
 * @param {{
 *   userId: string,
 *   title: string,
 *   message: string,
 *   type: "review" | "comment" | "like" | "custom",
 *   relatedDocId?: string,
 *   senderId?: string,
 *   senderName?: string,
 *   senderPhotoURL?: string
 * }} data - Notification data
 */
export async function createNotification(data) {
    try {
        data.message = NOTIFICATION_MESSAGES[data.type];

        const notificationData = {
            ...data,
            read: false,
            createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "notifications"), notificationData);
    } catch (error) {
        console.error("[notifications.js] Error creating notification:", error);
        throw error;
    }
}