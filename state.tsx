import { onAuthStateChanged } from "firebase/auth";
import React, { Dispatch, useEffect, useReducer } from "react";
import { auth } from "./firebaseConfig";
import { Recipe } from "./Models/Recipe";
import { RecipeBook } from "./Models/RecipeBook";
import { User } from "./Models/User";
import { getDatabase, ref, onValue, update } from "firebase/database";
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


const UserContext = React.createContext(State.user);
const RecipeBookStateContext = React.createContext({ recipeBook: State.recipeBook, setRecipeBook: (recipeBook: RecipeBook) => {}});
const FeaturedRecipeStateContext = React.createContext({ featuredRecipe: State.featuredRecipe, setFeaturedRecipe: undefined as unknown as Dispatch<React.SetStateAction<Recipe>> });

export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [user, setUser] = React.useState(State.user);

    const [recipeBook, setRecipeBook] = useReducer(
        (_currentValue: RecipeBook, newValue: RecipeBook) => {
            
            newValue.saveData();
            
            if (user) {
                const db = getDatabase();
                const updates: any = {};
                updates['/users/' + user.uid + "/RecipeBook"] = newValue;
                update(ref(db), updates);
            }

            return newValue.clone();
        },
        State.recipeBook
    );

    const recipeBookContextValue = { recipeBook, setRecipeBook };

    const [featuredRecipe, setFeaturedRecipe] = React.useState(State.featuredRecipe);
    const featuredRecipeContextValue = { featuredRecipe, setFeaturedRecipe };


    useEffect(() => {
        let loggedIn = false;
        // TODO: Docs
        onAuthStateChanged(auth, (u) => {
            if (u) {
                loggedIn = true;
                setUser(new User(u.uid, u.displayName || "", u.email || "", 0, 0, "Beginner"));
                const db = getDatabase();

                onValue(ref(db, "/users/" + u.uid + "/RecipeBook"), (snapshot) => {
                    if (snapshot.val()) {
                        recipeBook.importData(snapshot.val());
                        setRecipeBook(recipeBook);
                    }
                })
            }
            else if (loggedIn) {
                loggedIn = false;
                setUser(undefined);
                setRecipeBook(RecipeBook.Initial());
            }
            else {
                setUser(undefined);
            }

        } )
    }, [])
    

    return (
        <UserContext.Provider value={user}>
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