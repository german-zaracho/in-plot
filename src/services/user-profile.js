import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} id 
 * @returns 
 */
// {{id: string, email: string, displayName: string|null, favMovie: string|null, favSeries: string|null, photoURL: string|null}}
export async function getUserProfileById(id){
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
 * @param {{displayName: string, favMovie: string, favSeries: string, anAdditionalComment:string, photoURL: string }} data
 */

export async function editUserProfile(id, data ) {
    const profileRef = doc(db, `user-profiles/${id}`);
    return await updateDoc(profileRef, data);
}