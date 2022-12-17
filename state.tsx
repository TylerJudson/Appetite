import React, { Dispatch, useReducer } from "react";
import { Recipe } from "./Models/Recipe";
import { RecipeBook } from "./Models/RecipeBook";


// TODO: Documentation

export const State = {
    recipeBook: RecipeBook.Initial(),
    featuredRecipe: Recipe.ReadonlyInital(),
}


const RecipeBookStateContext = React.createContext({ recipeBook: State.recipeBook, setRecipeBook: (recipeBook: RecipeBook) => {}});
const FeaturedRecipeStateContext = React.createContext({ featuredRecipe: State.featuredRecipe, setFeaturedRecipe: undefined as unknown as Dispatch<React.SetStateAction<Recipe>> });

export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [recipeBook, setRecipeBook] = useReducer(
        (currentValue: RecipeBook, newValue: RecipeBook) => {
            // newValue.saveData();
            return newValue.clone();
        },
        State.recipeBook
    );

    const recipeBookContextValue = { recipeBook, setRecipeBook };

    const [featuredRecipe, setFeaturedRecipe] = React.useState(State.featuredRecipe);
    const featuredRecipeContextValue = { featuredRecipe, setFeaturedRecipe };

    return (
        <RecipeBookStateContext.Provider value={recipeBookContextValue}>
            <FeaturedRecipeStateContext.Provider value={featuredRecipeContextValue}>
            {children}
            </FeaturedRecipeStateContext.Provider>
        </RecipeBookStateContext.Provider>
    );
};

export const useRecipeBookState = () => React.useContext(RecipeBookStateContext);
export const useFeaturedRecipeState = () => React.useContext(FeaturedRecipeStateContext);