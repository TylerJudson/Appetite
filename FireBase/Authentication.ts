import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
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
                return "Invalid Email";
            }
            else if (error.code === "auth/wrong-password") {
                return "Wrong Password";
            }
            else {
                return error.code;
            }
            

        });
}


// TODO: docs
export async function forgotPassword(email: string) {
    return await sendPasswordResetEmail(auth, email)
        .then(() => {
            return "Success";
        })
        .catch((error) => {
            if (error.code === "auth/missing-email") {
                return "Invalid Email";
            }
            else if (error.code === "auth/invalid-email") {
                return "Invalid Email";
            }
            else {
                return error.code;
            }
        });
}