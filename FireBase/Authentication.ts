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
    return await signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            return "Success";
        })
        .catch((error) => {
            if (error.code === "auth/invalid-email") {
                return "Couldn't find your Account";
            }
            else if (error.code === "auth/wrong-password") {
                return "Wrong Password. Try again or click Forgot password.";
            }
            else {
                return error.code
            }
            

        });
}