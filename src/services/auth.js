import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { getUserProfileById, createUserProfile } from "./user-profile";

//Check the different errors in the documentation to add messages
const AUTH_ERROR_MESSAGES = {
    'auth/invalid-credential': 'The credentials are invalid.',
    'auth/missing-password': 'The password cannot be empty.',
    'auth/missing-email': 'The email cannot be empty.',
    'auth/invalid-email': 'The email is empty or does not have a valid format.',
    'auth/email-already-in-use': 'The email is already in use.',
}

let userData = {
    id: null,
    email: null,
    displayName: null,
    favMovie: null,
    favSeries: null,
    anAdditionalComment: null,
    photoURL: null,
    fullProfileLoaded: false,
    role: null,
}

if (localStorage.getItem('user')) {
    userData = JSON.parse(localStorage.getItem('user'));
}

let observers = [];

onAuthStateChanged(auth, async (user) => {

    if (user) {
        const userProfile = await getUserProfileById(user.uid);
        updateUserData({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: userProfile.role,
        });
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
            role: null,
        });
        localStorage.removeItem('user');
    }

});

export async function register({ email, password, role = 'user' }) {

    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(credentials.user.uid, { email, role });
        // console.log('id', credentials.user.uid);
    } catch (error) {
        console.error("[auth.js register] Error trying to register user: ", error);
        throw AUTH_ERROR_MESSAGES[error.code] ?? error;
    }

}

export async function login({ email, password }) {

    try {

        const credentials = await signInWithEmailAndPassword(auth, email, password);
        // Wait for the user to be successfully authenticated
        await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    unsubscribe();
                    resolve();
                }
            });
        });
        // console.log("Successfully authenticated.");

    } catch (error) {
        console.error("[auth.js login] Authentication error: ", error);
        throw AUTH_ERROR_MESSAGES[error.code] ?? error;
    }

}

export async function logout() {
    return signOut(auth);
}

export function isAdmin() {
    return userData?.role === 'admin';
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
export async function updateUserData(newData) {

    userData = {
        ...userData,
        ...newData,
    }
    notifyAll();
    localStorage.setItem('user', JSON.stringify(userData));

}