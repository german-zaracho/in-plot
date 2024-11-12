import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { editUserProfile, getUserProfileById } from "./user-profile";

let userData = {
    id: null,
    email: null,
    displayName: null,
    favMovie: null,
    favSeries: null,
    anAdditionalComment: null,
}

let observers = [];

onAuthStateChanged(auth, async user => {
    if(user) {
        userData = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
        }

        const fullProfile = await getUserProfileById(userData.id);
        userData = {
            ...userData,
            favMovie: fullProfile.favMovie,
            favSeries: fullProfile.favSeries,
            anAdditionalComment: fullProfile.anAdditionalComment,
        }
    } else {
        userData = {
            id: null,
            email: null,
            displayName: null,
            favMovie: null,
            favSeries: null,
            anAdditionalComment: null,
        }
    }
    notifyAll();
})

export async function login({ email, password }) {

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Successfully authenticated.");
    } catch (error) {
        console.error("[auth.js login] Authentication error: ", error);
        throw error;
    }

}

/**
 * Modifies the values ​​of the authenticated user
 * @param {{ displayName: string, favMovie: string, favSeries: string, anAdditionalComment: string }} data
 */

export async function editMyProfile({ displayName, favMovie, favSeries, anAdditionalComment}) {
    try {
        await updateProfile(auth.currentUser, { displayName });
        await editUserProfile(user.id, { displayName, favMovie, favSeries, anAdditionalComment });
    } catch(error) {
        console.error("[auth.js editMyProfile] Error editing user profile: ", error);
    }
}

export async function logout() {
    return signOut(auth);
}


/**
 * Subscribe an observer to be notified of authentication state changes
 * @param { Function } callback
 */

export function subscribeToAuth(callback) {
    observers.push(callback);
    notify(callback);
}

/**
 * Notifies an observer of the current authentication state
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    callback({...userData});
}

/**
 * Notifies all observers
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}
