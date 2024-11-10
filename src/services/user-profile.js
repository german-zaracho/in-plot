import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserProfileById(id){
    const profileDoc = doc(db, `user-profiles/${id}`);
    const profileSnapshot = await getDoc(profileDoc);

    return {
        id: profileSnapshot.id,
        email: profileSnapshot.data().email,
        myName: profileSnapshot.data().myName,
        favMovie: profileSnapshot.data().favMovie,
        favSeries: profileSnapshot.data().favSeries,
        anAdditionalComment: profileSnapshot.data().anAdditionalComment,
    }
}

/**
 * Edit the profile data of the user indicated by their ID.
 * @param {string} id - The ID of the user.
 * @param {{myName: string, favMovie: string, favSeries: string, anAdditionalComment:string }} data
 */

export async function editUserProfile(id, { myName, favMovie, favSeries, anAdditionalComment }) {
    const profileDoc = doc(db, `user-profiles/${id}`);
    return await updateDoc(profileDoc, { myName, favMovie, favSeries, anAdditionalComment });
}