import { getItem, saveItem } from "../utilities/AsyncHelpers";
import { Recipe } from "./Recipe";


interface IRecipeBook {
    /** The recipes that make up the book. */
    recipes: Recipe[];
}

export class RecipeBook implements IRecipeBook {
    recipes: Recipe[];

    constructor(recipes: Recipe[] = []) {
        this.recipes = recipes
    }

    /**
     * Creates a blank recipe book object
     * @returns A new blank recipe book
     */
    static Initial() {
        return new RecipeBook();
    }

    /**
     * Gets all of the data from async storage (key: RecipeBook)
     */
    async getData() {
        await getItem("RecipeBook").then(
            (value) => {
                if (value) {
                    this.recipes = value.recipes;
                }
            },
        )
    }

    /**
     * Saves the current state of the object to async storage (key: RecipeBook)
     */
    async saveData() {
        await saveItem("RecipeBook", this);
    }

}