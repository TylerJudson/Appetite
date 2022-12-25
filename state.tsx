import { onAuthStateChanged } from "firebase/auth";
import React, { Dispatch, useEffect, useReducer } from "react";
import { auth } from "./firebaseConfig";
import { Recipe } from "./Models/Recipe";
import { RecipeBook } from "./Models/RecipeBook";
import { User } from "./Models/User";
import { getDatabase, ref, onValue } from "firebase/database";
import { importToObject } from "./utilities/importToObject";


// TODO: Documentation


interface IState {
    user: undefined | User;
    recipeBook: RecipeBook;
    featuredRecipe: Recipe;
}

export let State: IState = {
    user: undefined,
    recipeBook: RecipeBook.Initial(),
    featuredRecipe: Recipe.ReadonlyInital(),
}


const UserContext = React.createContext({ user: State.user, setUser: (user: User) => {}});
const RecipeBookStateContext = React.createContext({ recipeBook: State.recipeBook, setRecipeBook: (recipeBook: RecipeBook) => {}});
const FeaturedRecipeStateContext = React.createContext({ featuredRecipe: State.featuredRecipe, setFeaturedRecipe: undefined as unknown as Dispatch<React.SetStateAction<Recipe>> });

export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [user, setUser] = React.useState(State.user);

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


    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(new User(u.uid, u.displayName || "", u.email || "", 0, 0, "Beginner"));
                const db = getDatabase();

                onValue(ref(db, "users/" + u.uid + "/RecipeBook"), (snapshot) => {
                    if (snapshot.val()) {
                        importToObject(recipeBook, snapshot.val());
                        setRecipeBook(recipeBook);
                    }
                })
            }
            else {
                setUser(undefined);
                setRecipeBook(RecipeBook.Initial());
            }
        } )
    }, [])
    

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <RecipeBookStateContext.Provider value={recipeBookContextValue}>
                <FeaturedRecipeStateContext.Provider value={featuredRecipeContextValue}>
                {children}
                </FeaturedRecipeStateContext.Provider>
            </RecipeBookStateContext.Provider>
        </UserContext.Provider>
    );
};

export const useUserState = () => React.useContext(UserContext);
export const useRecipeBookState = () => React.useContext(RecipeBookStateContext);
export const useFeaturedRecipeState = () => React.useContext(FeaturedRecipeStateContext);