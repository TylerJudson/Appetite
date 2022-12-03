import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";


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
    /** The time it takes to prepare the recipe (in minutes) */
    prepTime?: number;
    /** The time it takes to cook the recipe (in minutes) */
    cookTime?: number;
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
    prepTime?: number;
    cookTime?: number;
    tags: string[];
    readonly: boolean

    constructor(name: string, ingredients: string[], instructions: string[], prepTime?: number, cookTime?: number, tags: string[] = [], readonly: boolean = false) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.tags = tags;
        this.readonly = readonly;

        this.image = ""; // TODO: find a default image for this
        this.id = uuidv4();
    }    

    static Initial() {
        return new Recipe("", [], []);
    }
    static ReadonlyInital() {
        return new Recipe("", [], [], undefined, undefined, [], true)
    }
}
