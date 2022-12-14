import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { Recipe } from './Recipe';


interface IPost {
    /** The unique identifier for the post */
    id: string;
    /** The recipe */
    recipe: Recipe;
    /**  The User's description of when they used the recipe */
    description: string;
    /** the amount of likes the recipe has */
    likes: number;
    /** The time the post was posted */
    timestamp: string; // TODO: find datetime
}


export class Post implements IPost {
    id: string;
    recipe: Recipe;
    description: string;
    likes: number;
    timestamp: string;

    constructor(id: string, recipe: Recipe, description: string, likes: number, timestamp) {
        this.id = id;
        this.recipe = recipe;
        this.description = description;
        this.likes = likes;
        this.timestamp = timestamp
    }
    



    // TODO: Initial stuff
}
