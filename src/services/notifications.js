import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const NOTIFICATION_MESSAGES = {
    review: "Has posted a new review.",
    newComment: "has commented on your review.",
    editComment: "has edited your comment.",
    deleteComment: "has deleted your comment.",
    editReview: "has edited your review.",
    deleteReview: "has deleted your review.",
    like: "Liked your review",
    custom: "",
};

const NOTIFICATION_TITLES = {
    review: "New review",
    newComment: "New comment",
    editComment: "Comment edited",
    deleteComment: "Comment deleted",
    editReview: "Review edited",
    deleteReview: "Review deleted",
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

        if (data.senderName === null || data.senderName === undefined) {
            data.senderName = "Someone";
        };

        data.message = `${data.senderName} ${NOTIFICATION_MESSAGES[data.type]}`;

        const notificationData = {
            ...data,
            read: false,
            title: NOTIFICATION_TITLES[data.type],
            createdAt: serverTimestamp(),
        };
        // console.log("Notification data:", notificationData);

        await addDoc(collection(db, "notifications"), notificationData);
        // console.log("Notification created successfully");
    } catch (error) {
        console.error("[notifications.js] Error creating notification:", error);
        throw error;
    }
}

/**
 * Get all notifications for a specific user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserNotifications(userId) {

    try {
        const notificationsRef = collection(db, "notifications");
        const q = query(
            notificationsRef,
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return notifications;
    } catch (error) {
        console.error("[notifications.js] Error fetching notifications:", error);
        throw error;
    }

}

export async function deleteMultipleNotifications(ids) {

    try {
        const deletePromises = ids.map(id => deleteDoc(doc(db, "notifications", id)));
        await Promise.all(deletePromises);
        // console.log("Selected notifications deleted");
    } catch (error) {
        console.error("[notifications.js] Error deleting multiple notifications:", error);
        throw error;
    }
    
}













