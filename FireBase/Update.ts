import { getDatabase, update, ref } from "firebase/database";
import { Recipe } from "../Models/Recipe";
import { User } from "../Models/User";



/**
 * Updates a recipe in the firebase database
 * @param user The user, to update the recipe to
 * @param recipe The recipe to update
 * @param create Whether or not the recipe is being created or just updated
 */
export function updateRecipe(user: User | undefined, recipe: Recipe, create: boolean = false) {
    if (user) {
        const db = getDatabase();
        let updates: any = {};
        let updatedRecipe = recipe.onlyDefinedProperties();
        
        // Add a date created attribute if we are creating the recipe
        if (create) {
            updatedRecipe["created"] = Date.now();
        }
        updates['/users/' + user.uid + "/recipes/" + recipe.id] = updatedRecipe;
        updates['/users/' + user.uid + "/recipeImages/" + recipe.id] = recipe.image;
        update(ref(db), updates);
    }
}