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
    /** The author of the post */
    author: string;
    /** The author's picture */
    authorPic?: string;
    /** The number of likes the post has received */
    likes: number;
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
    author: string;
    authorPic?: string;
    likes: number;
    image: string;
    title: string;
    description: string;
    linkedRecipe?: Recipe;
    comments: Comment[];
    timeStamp: number

    constructor(id: string, author: string, authorPic: string | undefined, likes: number, image: string, title: string, description: string, linkedRecipe: Recipe | undefined, comments: Comment[], timeStamp: number) {
        this.id = id;
        this.author = author;
        this.authorPic = authorPic;
        this.likes = likes;
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