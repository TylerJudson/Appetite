
// TODO: Docs

interface IUser {
    uid: string;
    displayName: string;
    email: string
    numOfFriends: number;
    numOfPosts: number;
    skillLevel: "Beginner" | "Intermediate" | "Advanced";
}




export class User implements IUser {
    uid: string;
    displayName: string;
    email: string
    numOfFriends: number;
    numOfPosts: number;
    skillLevel: "Beginner" | "Intermediate" | "Advanced";


    constructor(uid: string, displayName: string, email: string, numOfFriends: number, numOfPosts: number, skillLevel: "Beginner" | "Intermediate" | "Advanced") {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.numOfFriends = numOfFriends;
        this.numOfPosts = numOfPosts;
        this.skillLevel = skillLevel;
    }

}