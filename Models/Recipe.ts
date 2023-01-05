import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { getItem, saveItem } from '../utilities/AsyncHelpers';


interface IRecipe {
    /** The unique Identifier for the recipe */
    id: string;
    /** The name of the recipe. */
    name: string;
    /** The image of the recipe. */
    image: string;
    /** The ingredients required for the recipe. */
    ingredients: string[];
    /** The istructions to make the recipe */
    instructions: string[];
    /** The description of the recipe. */
    description?: string;
    /** The time it takes to prepare the recipe (in minutes) */
    prepTime?: number;
    /** The time it takes to cook the recipe (in minutes) */
    cookTime?: number;
    /** Whether or not the recipe has been favorited */
    favorited: boolean
    /** Tags the user can add to organize recipes better. i.e. healthy, breakfast, lunch, cookies, etc. */
    tags: string[];
    /** If the recipe is readonly or not. Set this property to true to prevent people from editing it.Defaults to false. */
    readonly: boolean;
}


export class Recipe implements IRecipe {
    id: string
    name: string;
    image: string;
    ingredients: string[];
    instructions: string[];
    description?: string;
    prepTime?: number;
    cookTime?: number;
    favorited: boolean;
    tags: string[];
    readonly: boolean;

    constructor(name: string, ingredients: string[], instructions: string[], description: string = "", image: string = "", id: string = "", prepTime?: number, cookTime?: number, favorited: boolean = false, tags: string[] = [], readonly: boolean = false) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.description = description;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.tags = tags;
        this.readonly = readonly;

        this.favorited = favorited;
        this.image = image; // TODO: find a default image for this
        this.id = id || uuidv4();
    }    

    /**
     * Creates a blank recipe
     * @returns a blank recipe
     */
    static Initial() {
        return new Recipe("", [], []);
    }
    /**
     * Creates a blank recipe that is readonly
     * @returns A blank recipe that is readonly
     */
    static ReadonlyInital() {
        return new Recipe("", [], [], "", undefined, undefined, undefined, undefined, false, [], true)
    }

    /**
     * Creates a clone of the current state of the recipe
     * @returns A shallow clone of the Recipe
     */
    clone() {
        return new Recipe(this.name, this.ingredients, this.instructions, this.description, this.image, this.id, this.prepTime, this.cookTime, this.favorited, this.tags, this.readonly);
    }

}
