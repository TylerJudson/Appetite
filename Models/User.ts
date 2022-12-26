
interface IUser {
    /** The unique user identifier. This is guarenteed to be unique. */
    uid: string;
    /** The name the user has chosen to publicly display. */
    displayName: string;
    /** The email of the user. */
    email: string
    /** The number of friends a user has. */
    numOfFriends: number;
    /** The number of posts a user has */
    numOfPosts: number;
    /** The skillLevel of the user. Beginner or Intermediate or Advanced. */
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