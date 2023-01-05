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
     * Get's all of the tags from all of the recipes in the book and sorts in the order of most used.
     * @returns All of the tags in the recipe book
     */
    getAllTags() {
        let ret: { [tag: string]: number; } = {};
        Object.values(this.recipes).forEach((recipe) => {
            recipe.tags.forEach((tag) => {
                if (tag in ret) {
                    ret[tag] += 1;
                }
                else {
                    ret[tag] = 1;
                }
            })
        })

        // Step - 1
        // Create the array of key-value pairs
        var items: [string, number][] = Object.keys(ret).map(
            (key) => { return [key, ret[key]] });

        // Step - 2
        // Sort the array based on which has the most
        items.sort(
            (first, second) => { return second[1] - first[1] }
        );

        // Step - 3
        // Obtain the list of keys in sorted order of the values.
        return items.map(
            (e) => { return e[0] });

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
        const cleanRecipeBook = RecipeBook.Initial();
        await getItem("RecipeBook", cleanRecipeBook);
        Object.values(cleanRecipeBook.recipes).forEach(recipe => {
            this.recipes[recipe.id] = new Recipe(recipe.name, recipe.ingredients, recipe.instructions, recipe.description, recipe.image, recipe.id, recipe.prepTime, recipe.cookTime, recipe.favorited, recipe.tags, recipe.readonly);
        });
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