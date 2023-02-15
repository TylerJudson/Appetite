import { Recipe } from "./Recipe";

export type Comment = {
    commentId: string;
    author: { authorId: string, authorName: string, authorPic?: string };
    value: string;
    date: number;
}


interface IPost {
    /** The unique Identifier for the post */
    id: string;
    /** The name of the author of the post */
    authorName: string;
    /** The id of the author of the post */
    authorId: string;
    /** The author's picture */
    authorPic?: string;
    /** The array of user id's of people who have favorited the post */
    favorited: string[];
    /** The image of the post */
    image: string;
    /** The title of the post */
    title: string;
    /** The description of the post */
    description: string;
    /** The recipe linked to the post */
    linkedRecipe?: Recipe;
    /** The comments on the post */
    comments: Comment[] 
    /** The time the post was posted */
    timeStamp: number
}


export class Post implements IPost {
    id: string;
    authorName: string;
    authorId: string
    authorPic?: string;
    favorited: string[];
    image: string;
    title: string;
    description: string;
    linkedRecipe?: Recipe;
    comments: Comment[];
    timeStamp: number

    constructor(id: string, authorName: string, authorId: string, authorPic: string | undefined, favorited: string[], image: string, title: string, description: string, linkedRecipe: Recipe | undefined, comments: Comment[], timeStamp: number) {
        this.id = id;
        this.authorName = authorName;
        this.authorId = authorId;
        this.authorPic = authorPic;
        this.favorited = favorited;
        this.image = image;
        this.title = title;
        this.description = description;
        this.linkedRecipe = linkedRecipe;
        this.comments = comments;
        this.timeStamp = timeStamp;
    }

    /**
     * Creates a blank post
     * @returns a blank post
     */
    static Initial() {
        return new Recipe("", [], []);
    }
}