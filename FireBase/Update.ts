import { getDatabase, update, ref } from "firebase/database";
import { Recipe } from "../Models/Recipe";
import { User } from "../Models/User";



// TODO: docs
export function updateRecipe(user: User | undefined, recipe: Recipe, create: boolean = false) {
    if (user) {
        const db = getDatabase();
        let updates: any = {};
        let updatedRecipe = recipe.onlyDefinedProperties();
        
        if (create) {
            updatedRecipe["created"] = Date.now();
        }
        updates['/users/' + user.uid + "/recipes/" + recipe.id] = updatedRecipe;
        updates['/users/' + user.uid + "/recipeImages/" + recipe.id] = recipe.image;
        update(ref(db), updates);
    }
}