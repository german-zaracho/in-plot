import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function login( { email, password } ) {

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Successfully authenticated.");
    } catch (error) {
        console.error("[auth.js login] Authentication error: ", error);
        throw error;
    }

}

export async function register( { email, password } ) {

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error("[auth.js register] Authentication error: ", error);
        throw error;
    }

}

export async function logout() {
    return signOut(auth);
}