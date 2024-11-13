import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} id 
 * @returns 
 */
export async function getUserProfileById(id){
    const profileRef = doc(db, `user-profiles/${id}`);
    const profileSnapshot = await getDoc(profileRef);

    return {
        id: profileSnapshot.id,
        email: profileSnapshot.data().email,
        displayName: profileSnapshot.data().displayName,
        favMovie: profileSnapshot.data().favMovie,
        favSeries: profileSnapshot.data().favSeries,
        anAdditionalComment: profileSnapshot.data().anAdditionalComment,
    }
}

/**
 * 
 * @param {string} id 
 * @param {{email: string}} data 
 */
export async function createUserProfile(id, { email }) {
    const profileRef = doc(db, `user-profiles/${id}`);

    await setDoc(profileRef, {
        email,
    });
}

/**
 * Edit the profile data of the user indicated by their ID.
 * @param {string} id - The ID of the user.
 * @param {{displayName: string, favMovie: string, favSeries: string, anAdditionalComment:string }} data
 */

export async function editUserProfile(id, { displayName, favMovie, favSeries, anAdditionalComment }) {
    const profileRef = doc(db, `user-profiles/${id}`);
    return await updateDoc(profileRef, { displayName, favMovie, favSeries, anAdditionalComment });
}