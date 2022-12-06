import React, { Dispatch } from "react";
import { Recipe } from "./Models/Recipe";


// TODO: Documentation


class FeaturedRecipeState {
    recipe: Recipe = Recipe.ReadonlyInital();
}

const FeaturedRecipeStateContext = React.createContext({ featuredRecipe: new FeaturedRecipeState, setFeaturedRecipe: undefined as unknown as Dispatch<React.SetStateAction<FeaturedRecipeState>> })


export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [featuredRecipe, setFeaturedRecipe] = React.useState(new FeaturedRecipeState());
    const featuredRecipeContextValue = React.useMemo(() => ({ featuredRecipe, setFeaturedRecipe }), [featuredRecipe]);

    
    return (
        <FeaturedRecipeStateContext.Provider value={featuredRecipeContextValue}>
            {children}
        </FeaturedRecipeStateContext.Provider>
    );
};

export const useFeaturedRecipeState = () => React.useContext(FeaturedRecipeStateContext);