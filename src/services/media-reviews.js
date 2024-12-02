import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * 
 * @param { string } id 
 * @param {{ title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, }} data 
 */
export async function createNewReview(id, { title, synopsis, trailer, year, coverURL, contentType }) {

    const reviewRef = collection(db, `media-reviews`);

    await addDoc(reviewRef, {
        user_id: id,
        title,
        synopsis,
        trailer,
        year,
        contentType,
        coverURL,
        created_at: serverTimestamp(),
    });

}

/**
 * 
 * @returns {Promise<Array<{ id: string, user_id: string, title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, displayName: string | null, email: string }>>}
 */
// Obtains the reviews and checks if the user has displayName, otherwise it passes the email
export async function getAllReviews() {

    const reviewsCollection = collection(db, "media-reviews");
    const reviewsSnapshot = await getDocs(reviewsCollection);

    const reviews = await Promise.all(
        reviewsSnapshot.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();

            let displayName = null;

            const userProfileRef = doc(db, "user-profiles", reviewData.user_id);
            const userProfileDoc = await getDoc(userProfileRef);

            if (userProfileDoc.exists()) {
                const userProfile = userProfileDoc.data();
                displayName = userProfile.displayName || userProfile.email;
                // console.log(displayName);
            }

            return {
                id: reviewDoc.id,
                ...reviewData,
                displayName,
            };
        })
    );

    return reviews;

}

/**
 * Get user reviews
 * @param {string} userId
 * @returns {Promise<Array<{ id: string, user_id: string, title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, displayName: string | null }>>}
 */
export async function getReviewsByUser(userId) {

    const allReviews = await getAllReviews();
    return allReviews.filter(review => review.user_id === userId);
    
}

// Compares the params and returns the review information
export async function getReviewById(id) {

    const reviewRef = doc(db, "media-reviews", id);
    const reviewSnapshot = await getDoc(reviewRef);

    if (reviewSnapshot.exists()) {
        const reviewData = reviewSnapshot.data();
        let displayName = null;

        const userProfileRef = doc(db, "user-profiles", reviewData.user_id);
        const userProfileDoc = await getDoc(userProfileRef);

        if (userProfileDoc.exists()) {
            const userProfile = userProfileDoc.data();
            displayName = userProfile.displayName || userProfile.email;
        }

        return {
            id: reviewSnapshot.id,
            ...reviewData,
            displayName,
        };
    } else {
        throw new Error("Review not found");
    }

}

export async function updateReview(reviewId, reviewData) {

    const reviewRef = doc(db, "media-reviews", reviewId);
    await updateDoc(reviewRef, reviewData);

}

/**
 * If a new image is added, it deletes the previous one, creates a reference for the new image, saves it and returns the url
 * @param {File} file - image file
 * @param {string} reviewId - 
 * @returns {Promise<string>} image url
 */
export async function uploadCoverImage(file, userId, existingCoverURL = '') {

    try {
        // console.log("file", file, "userId", userId, "existingCoverURL", existingCoverURL);

        if (existingCoverURL) {
            const oldCoverRef = ref(storage, existingCoverURL); 
            await deleteObject(oldCoverRef);
        }

        const fileRef = ref(storage, `reviews/${userId}/${file.lastModified}_cover.jpg`);
        await uploadBytes(fileRef, file);
        const coverURL = await getDownloadURL(fileRef);

        return coverURL;
    } catch (error) {
        console.error('Error uploading cover image:', error);
        throw new Error('Error uploading image');
    }

}

