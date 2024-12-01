import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param { string } id 
 * @param {{ title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, }} data 
 */
export async function createNewReview(id, {title, synopsis, trailer, year, coverURL, contentType}) {

    
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
export async function getAllReviews() {
    const reviewsCollection = collection(db, "media-reviews");
    const reviewsSnapshot = await getDocs(reviewsCollection);
    // console.log();
    // return reviewsSnapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data(),
    // }));

    // Obtenemos todas las reseñas y las procesamos
    const reviews = await Promise.all(
        reviewsSnapshot.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();

            // Buscar en user-profiles el displayName o el email correspondiente
            let displayName = null;

            const userProfileRef = doc(db, "user-profiles", reviewData.user_id);  // Accedemos al documento con el user_id
            const userProfileDoc = await getDoc(userProfileRef);

            if (userProfileDoc.exists()) {
                const userProfile = userProfileDoc.data();
                displayName = userProfile.displayName || userProfile.email;  // Si no tiene displayName, usamos el email
                console.log(displayName);
            }

            
            return {
                id: reviewDoc.id,
                ...reviewData,
                displayName, // Añadimos el displayName o el email
            };
        })
    );

    return reviews;
    
}

/**
 * Obtiene las reseñas creadas por un usuario específico.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array<{ id: string, user_id: string, title: string, synopsis: string, trailer: string, year: string, coverURL: string, contentType: string, displayName: string | null }>>}
 */
export async function getReviewsByUser(userId) {
    const allReviews = await getAllReviews();
    return allReviews.filter(review => review.user_id === userId);
}
