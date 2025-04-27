import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { storage, db, auth, getFileURL, uploadFile } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Creates a new review for the authenticated user.
 * @param {File|null} coverImage - Optional cover image file
 * @param {{ title: string, synopsis: string, trailer: string, year: string, contentType: string }} data
 */
export async function createNewReview(coverImage, data) {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated.");
        }

        let coverImageURL = '';

        if (coverImage) {
            const folderPath = `reviews/${user.uid}/`;
            const filePath = `${folderPath}${Date.now()}_cover.jpg`;
            await uploadFile(filePath, coverImage);
            coverImageURL = await getFileURL(filePath);
        }

        const reviewRef = collection(db, "media-reviews");

        await addDoc(reviewRef, {
            user_id: user.uid,
            title: data.title,
            synopsis: data.synopsis,
            trailer: data.trailer,
            year: data.year,
            contentType: data.contentType,
            coverURL: coverImageURL || '',
            created_at: serverTimestamp(),
        });

        console.log('Review created successfully!');
    } catch (error) {
        console.error('[media-reviews.js createNewReview] Error creating review:', error);
        throw error;
    }
}


/**
 * 
 * @returns {Promise<Array<{ id: string, user_id: string, title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, displayName: string | null, email: string }>>}
 */
// Obtains the reviews and checks if the user has displayName, otherwise it passes the email
export async function getAllReviews() {

    const reviewsCollection = collection(db, "media-reviews");
    const reviewsQuery = query(reviewsCollection, orderBy("created_at", "desc"));

    const reviewsSnapshot = await getDocs(reviewsQuery);

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

    const allReviews = await getAllReviews();
    const review = allReviews.find(review => review.id === id);

    if (!review) {
        throw new Error("Review not found");
    }

    return review;

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

/**
 * Deletes a review from Firestore and its associated image from Firebase Storage
 * @param {string} reviewId - The ID of the review to delete
 */
export async function deleteReview(reviewId) {
    try {
        const reviewRef = doc(db, "media-reviews", reviewId);
        const reviewSnapshot = await getDoc(reviewRef);

        if (!reviewSnapshot.exists()) {
            throw new Error("Review not found");
        }

        const reviewData = reviewSnapshot.data();
        const coverURL = reviewData.coverURL;

        // Delete the image from Firebase Storage if it exists
        if (coverURL) {
            try {
                const coverRef = ref(storage, coverURL);
                await deleteObject(coverRef);
                console.log("Cover image deleted successfully");
            } catch (storageError) {
                console.error("Error deleting cover image:", storageError);
            }
        }

        // Delete the review from Firestore
        await deleteDoc(reviewRef);
        console.log("Review deleted successfully");
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
}

