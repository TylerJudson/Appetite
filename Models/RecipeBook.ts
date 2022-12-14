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

}