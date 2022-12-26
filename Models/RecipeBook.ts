import { getItem, saveItem } from "../utilities/AsyncHelpers";
import { Recipe } from "./Recipe";
import { Result } from "./Result";


interface IRecipeBook {
    /** The recipes that make up the book. */
    recipes: { [id: string ]: Recipe; };
}

export class RecipeBook implements IRecipeBook {
    recipes: { [id: string]: Recipe; };

    constructor(recipes: { [ id: string ]: Recipe; } = {}) {
        this.recipes = recipes
    }

    /**
     * Adds a recipe returning the result.
     * @param recipe The recipe to add to the book
     * @returns The Result (true or false) and a corresponding message (if false)
     */
    addRecipe(recipe: Recipe) {
        if (recipe.id in this.recipes) {
            return new Result(false, "This recipe already exists in your Recipe Book.");
        }
        else {
            this.recipes[recipe.id] = recipe;
            return new Result(true);
        }
    }
    /**
     * Deletes a recipe from the recipe book returning the result
     * @param recipe The recipe to delete from the book
     * @returns The Result (true or false) and a corresponding message (if false)
     */
    deleteRecipe(recipe: Recipe) {
        if (recipe.id in this.recipes) {
            delete this.recipes[recipe.id];
            return new Result(true);
        }
        else {
            return new Result(false, "This recipe doesn't exsist in your Recipe Book.");
        }
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
        await getItem("RecipeBook", this);
    }

    /**
     * Saves the current state of the object to async storage (key: RecipeBook)
     */
    async saveData() {
        await saveItem("RecipeBook", this);
    }

    /**
     * Creates a clone of the current state of the RecipeBook
     * @returns The shallow cloned RecipeBook
     */
    clone() {
        return new RecipeBook(this.recipes);
    }

}