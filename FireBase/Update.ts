import { getDatabase, update, ref } from "firebase/database";
import { Recipe } from "../Models/Recipe";
import { User } from "../Models/User";




export function updateRecipe(user: User | undefined, recipe: Recipe) {
    if (user) {
        const db = getDatabase();
        let updates: any = {};
        updates['/users/' + user.uid + "/recipes/" + recipe.id] = recipe.onlyDefinedProperties();
        updates['/users/' + user.uid + "/recipeImages/" + recipe.id] = recipe.image;
        update(ref(db), updates);
    }
}