import { signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { User } from "../Models/User";




export async function logout() {
    await signOut(auth);
}


export async function loginEmailPassword() {
    const loginEmail = "Guest0@appetite.com";
    const loginPassword = "Guest-0";

    return await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
            return new User(
                    userCredential.user.uid, 
                    userCredential.user.displayName || "", 
                    userCredential.user.email || "",
                    0, 0, "Beginner");
        })
        .catch((reason) => {
            console.log("There was an error.");
        });
}