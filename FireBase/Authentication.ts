import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth";
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


/**
 * handles the acion of forgetting the password
 * @param email The email to sent the forgot password notification to
 * @returns The result, "Succes" or "Invalid Email"
 */
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

// TODO: dcos
export async function createAccount(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password)
    .then((u) => {
        return {code: "Success", uid: u.user.uid};
    })
    .catch(error => {
        if (error.code === "auth/invalid-email") {
            return "Invalid Email";
        }
        else if (error.code === "auth/weak-password") {
            return "Weak Password";
        }
        else if (error.code === "auth/email-already-in-use") {
            return "Account Exists";
        }
        else {
            return error.code
        }
    })
}



export async function changePassword(newPassword: string) {
    const user = auth.currentUser;
    if (user) {
        return await updatePassword(user, newPassword)
        .then(() => {
            return "Success";
        }).catch((error) => {
            console.log(error);
            
            if (error.code === "auth/weak-password") {
                return "Weak Password";
            }
            else {
                return error.code
            }
        });
    }
    else {
        return "Not Signed In";
    }
}