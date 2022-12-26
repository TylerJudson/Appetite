import { signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * Securly logs the user out of their account.
 */
export async function logout() {
    await signOut(auth);
}


/**
 * Logs a user in with a particular email and password
 * @param email The email to log the user in with
 * @param password The password to log the user in with
 */
export async function loginEmailPassword(email: string, password: string) {
    const loginEmail = "Guest0@appetite.com";
    const loginPassword = "Guest-0";

    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .catch((reason) => {
            console.log("There was an error:", reason);
        });
}