import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { editUserProfile, getUserProfileById, createUserProfile } from "./user-profile";
import { getFileURL, uploadFile } from "./file-storage";

let userData = {
    id: null,
    email: null,
    displayName: null,
    favMovie: null,
    favSeries: null,
    anAdditionalComment: null,
    photoURL: null,
    fullProfileLoaded: false,
}

if(localStorage.getItem('user')) {
    userData = JSON.parse(localStorage.getItem('user'));
}

let observers = [];

onAuthStateChanged(auth, user => {
    if (user) {
        updateUserData = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }

        getUserProfileById(userData.id).then(fullProfile => {
            updateUserData({
                favMovie: fullProfile.favMovie,
                favSeries: fullProfile.favSeries,
                anAdditionalComment: fullProfile.anAdditionalComment,
                fullProfileLoaded: true,
            });
        });

    } else {
        updateUserData({
            id: null,
            email: null,
            displayName: null,
            favMovie: null,
            favSeries: null,
            anAdditionalComment: null,
            photoURL: null,
            fullProfileLoaded: false,
        });
    }
});

export async function register({ email, password }) {

    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(credentials.user.uid, { email });
    } catch (error) {
        console.error("[auth.js register] Error trying to register user: ", error);
        throw error;
    }

}

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

export async function editMyProfile({ displayName, favMovie, favSeries, anAdditionalComment }) {
    try {

        const promiseAuth = updateProfile(auth.currentUser, { displayName });
        const promiseStore = editUserProfile(userData.id, { display, favMovie, favSeries, anAdditionalComment });
        await Promise.all([promiseAuth, promiseStore]);

        updateUserData({
            ...userData,
            displayName,
            favMovie,
            favSeries,
            anAdditionalComment,
        });
    } catch (error) {
        console.error("[auth.js editMyProfile] Error editing user profile: ", error);
    }
}

/**
 * 
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {

        const filepath = `users/${userData.id}/avatar.jpg`;

        await uploadFile(filepath, photo);

        const photoURL = await getFileURL(filepath);
        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(userData.id, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateUserData({ photoURL });

    } catch (error) {
        console.error('[auth.js editMyProfilePhoto] Error editing profile photo: ', error);
        throw error;
    }
}

export async function logout() {
    return signOut(auth);
}


/**
 * Subscribe an observer to be notified of authentication state changes
 * @param { Function } callback
 * @returns {Function}
 */

export function subscribeToAuth(callback) {
    observers.push(callback);
    notify(callback);

    return () => {
        observers = observers.filter(obs => obs !== callback)
    };
}

/**
 * Notifies an observer of the current authentication state
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    callback({ ...userData });
}

/**
 * Notifies all observers
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * @param {{}} newData 
 */
function updateUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    }
    notifyAll();
    localStorage.setItem('user', JSON.stringify(userData));
}