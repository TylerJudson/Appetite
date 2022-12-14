import React, { Dispatch } from "react";
import { Recipe } from "./Models/Recipe";
import { RecipeBook } from "./Models/RecipeBook";


// TODO: Documentation

export const State = {
    recipeBook: RecipeBook.Initial(),
    featuredRecipe: Recipe.ReadonlyInital(),
}


const RecipeBookStateContext = React.createContext({ recipeBook: State.recipeBook, setRecipeBook: undefined as unknown as Dispatch<React.SetStateAction<RecipeBook>> });
const FeaturedRecipeStateContext = React.createContext({ featuredRecipe: State.featuredRecipe, setFeaturedRecipe: undefined as unknown as Dispatch<React.SetStateAction<Recipe>> });

export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [recipeBook, setRecipeBook] = React.useState(State.recipeBook);
    const recipeBookContextValue = React.useMemo(() => ({ recipeBook, setRecipeBook }), [recipeBook]);

    const [featuredRecipe, setFeaturedRecipe] = React.useState(State.featuredRecipe);
    const featuredRecipeContextValue = React.useMemo(() => ({ featuredRecipe, setFeaturedRecipe }), [featuredRecipe]);

    return (
        <RecipeBookStateContext.Provider value={recipeBookContextValue}>
            <FeaturedRecipeStateContext.Provider value={featuredRecipeContextValue}>
            {children}
            </FeaturedRecipeStateContext.Provider>
        </RecipeBookStateContext.Provider>
    );
};

export const useFeaturedRecipeState = () => React.useContext(FeaturedRecipeStateContext);