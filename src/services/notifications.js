import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const NOTIFICATION_MESSAGES = {
    review: "Has posted a new review.",
    comment: "Has commented on your review.",
    editComment: "has edited your comment.",
    deleteComment: "has deleted your comment.",
    like: "Liked your review",
    custom: "",
};

const NOTIFICATION_TITLES = {
    review: "New review",
    comment: "New comment",
    editComment: "Comment edited",
    deleteComment: "Comment deleted",
    like: "New like",
    custom: "",
}; 

/**
 * Create a new notification
 * 
 * @param {{
 *   userId: string,
 *   title: string,
 *   message: string,
 *   type: "review" | "comment" | "editComment" | "like" | "custom",
 *   relatedDocId?: string,
 *   senderId?: string,
 *   senderName?: string,
 *   senderPhotoURL?: string
 * }} data - Notification data
 */
export async function createNotification(data) {
    try {

        data.message = `${data.senderName} ${NOTIFICATION_MESSAGES[data.type]}`;

        const notificationData = {
            ...data,
            read: false,
            title: NOTIFICATION_TITLES[data.type],
            createdAt: serverTimestamp(),
        };
        console.log("Notification data:", notificationData);

        await addDoc(collection(db, "notifications"), notificationData);
        console.log("Notification created successfully");
    } catch (error) {
        console.error("[notifications.js] Error creating notification:", error);
        throw error;
    }
}