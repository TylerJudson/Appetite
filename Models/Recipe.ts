
interface IRecipe {
    /** The name of the recipe. */
    name: string
    /** The image of the recipe. */
    image: string
    /** The ingredients required for the recipe. */
    ingredients: string[]
    /** The istructions to make the recipe */
    instructions: string[]
    /** The time it takes to prepare the recipe (in minutes) */
    prepTime?: number
    /** The time it takes to cook the recipe (in minutes) */
    cookTime?: number
    /** Tags the user can add to organize recipes better. i.e. healthy, breakfast, lunch, cookies, etc. */
    tags: string[]

    /** Edits the recipe, allowing the user to change specific values */
    Edit(): void; // TODO: fix the parameters for the edit function
}


class Recipe implements IRecipe {
    name: string;
    image: string;
    ingredients: string[];
    instructions: string[];
    prepTime?: number;
    cookTime?: number;
    tags: string[];

    constructor(name: string, ingredients: string[], instructions: string[], prepTime?: number, cookTime?: number, tags: string[] = []) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.tags = tags;

        this.image = ""; // TODO: find a default image for this
    }


    Edit(): void {
        throw new Error("Method not implemented.") // TODO: implement this function
    }    
}

