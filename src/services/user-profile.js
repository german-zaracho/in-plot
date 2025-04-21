import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth, uploadFile, getFileURL } from "./firebase";
import { updateProfile } from "firebase/auth";
import { updateUserData } from "./auth";

/**
 * @param {string} id 
 * @returns 
 */
// {{id: string, email: string, displayName: string|null, favMovie: string|null, favSeries: string|null, photoURL: string|null}}
export async function getUserProfileById(id) {

    const profileRef = doc(db, `user-profiles/${id}`);
    // console.log(db, 'id',id, 'profileRef', profileRef.data());
    const profileSnapshot = await getDoc(profileRef);

    return {
        // id,
        // ...profileSnapshot.data(),
        id: profileSnapshot.id,
        email: profileSnapshot.data().email,
        displayName: profileSnapshot.data().displayName,
        photoURL: profileSnapshot.data().photoURL,
        favMovie: profileSnapshot.data().favMovie,
        favSeries: profileSnapshot.data().favSeries,
        anAdditionalComment: profileSnapshot.data().anAdditionalComment,
        role: profileSnapshot.data().role,
    }

}

/**
 * 
 * @param {string} id 
 * @param {{email: string}} data 
 */
export async function createUserProfile(id, { email, role = "role" }) {

    const profileRef = doc(db, `user-profiles/${id}`);

    await setDoc(profileRef, {
        email,
        role,
    });

}

/**
 * Edit the profile data of the user indicated by their ID.
 * @param {string} id - User id
 * @param {{displayName: string, favMovie: string, favSeries: string, anAdditionalComment:string, photoURL: string }} data
 */
export async function editUserProfile(id, data) {

    const profileRef = doc(db, `user-profiles/${id}`);
    return await updateDoc(profileRef, data);

}


/**
 * Edit the profile picture of the authenticated user.
 * @param {File} photo - The photo to be uploaded.
 */
export async function editMyProfilePhoto(photo) {
    try {

        const user = auth.currentUser;
        // console.log("info", auth.currentUser, user.uid);
        const userId = user.uid;

        const filepath = `users/${userId}/avatar.jpg`;
        await uploadFile(filepath, photo);
        const photoURL = await getFileURL(filepath);
        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(user.uid, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateUserData({ photoURL });

    } catch (error) {
        console.error("[user-profile.js editMyProfilePhoto] Error editing profile picture:", error);
        throw error;
    }
}

/**
 * Modifies the values ​​of the authenticated user
 * @param {{ displayName: string, favMovie: string, favSeries: string, anAdditionalComment: string }} data
 */
export async function editMyProfile({ displayName, favMovie, favSeries, anAdditionalComment }) {
    try {
        const user = auth.currentUser;
        const userId = user.uid;

        // Update displayName in Firebase Auth
        const promiseAuth = updateProfile(user, { displayName });

        // Update Firestore with the remaining data
        const promiseFirestore = editUserProfile(userId, {
            displayName,
            favMovie,
            favSeries,
            anAdditionalComment,
        });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateUserData({
            displayName,
            favMovie,
            favSeries,
            anAdditionalComment,
        });

    } catch (error) {
        console.error("[user-profile.js editMyProfile] Error editing user profile:", error);
        throw error;
    }
}
