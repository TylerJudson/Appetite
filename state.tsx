import { onAuthStateChanged } from "firebase/auth";
import React, { Dispatch, useEffect, useReducer } from "react";
import { auth } from "./firebaseConfig";
import { Recipe } from "./Models/Recipe";
import { RecipeBook } from "./Models/RecipeBook";
import { User } from "./Models/User";
import { getDatabase, ref, onValue, update, onChildChanged, get, child, onChildAdded, onChildRemoved, query, limitToLast, orderByChild } from "firebase/database";
import { importToObject } from "./utilities/importToObject";
import { saveItem } from "./utilities/AsyncHelpers";


interface ISettings {
    showFavoritesAtTop: boolean;
    themeColor: "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "pink";
}

interface IState {
    user: undefined | User;
    recipeBook: RecipeBook;
    settings: ISettings;
}

export let State: IState = {
    user: undefined,
    recipeBook: RecipeBook.Initial(),
    settings: { showFavoritesAtTop: false, themeColor: "red" }
}


const UserContext = React.createContext(State.user);
const RecipeBookStateContext = React.createContext({ recipeBook: State.recipeBook, setRecipeBook: (recipeBook: RecipeBook) => {}});
const SettingsContext = React.createContext({settings: State.settings, setSettings: (settings: ISettings) => {}});

export const GlobalStateProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [user, setUser] = React.useState(State.user);

    const [recipeBook, setRecipeBook] = useReducer(
        (_currentValue: RecipeBook, newValue: RecipeBook) => {
            newValue.saveData();
            return newValue.clone();
        },
        State.recipeBook
    );

    const recipeBookContextValue = { recipeBook, setRecipeBook };

    const [settings, setSettings] = React.useReducer(
        (_currentValue: ISettings, newValue: ISettings) => {
            saveItem("Settings", newValue);
            return newValue;
        },
        State.settings
    );


    useEffect(() => {

        function updateRecipe(id: string, value: Recipe) {
            recipeBook.recipes[id] = new Recipe(
                value.name,
                value.ingredients || [],
                value.instructions || [],
                value.description || "",
                recipeBook.recipes[value.id]?.image || "",
                value.id,
                value.prepTime,
                value.cookTime,
                value.favorited,
                value.tags || []);
        }
        let loggedIn = false;
        onAuthStateChanged(auth, (u) => {
            if (u) {
                loggedIn = true;
                setUser(new User(u.uid, "", u.email || "", 0, 0, "Beginner", ""));
                
                const db = getDatabase();

                onValue(ref(db, "users-publicInfo/" + u.uid), (snapShot) => {
                    if (snapShot.exists() && snapShot.val()) {
                        setUser(new User(u.uid, snapShot.val().displayName, u.email || "", snapShot.val().numOfFriends, snapShot.val().numOfPosts, snapShot.val().skillLevel, snapShot.val().profilePicture));
                    }
                })

                const recipesRef = ref(db, "/users/" + u.uid + "/recipes");
                const recipeImagesRef = ref(db, "/users/" + u.uid + "/recipeImages");

                get(recipesRef).then(snapshot => {
                    if (snapshot.exists() && snapshot.val()) {
                        recipeBook.importData({recipes: snapshot.val()} as any);
                        get(recipeImagesRef).then(snapshot => {
                            if (snapshot.exists() && snapshot.val()) {
                                Object.keys(snapshot.val()).forEach((key: string) => {
                                    if (recipeBook.recipes[key]) {
                                        recipeBook.recipes[key].image = snapshot.val()[key];
                                    }
                                });
                                setRecipeBook(recipeBook);
                            }
                        })
                    }
                })


                onChildChanged(recipesRef, (data) => {
                    if (data.exists() && data.key && data.val()) {
                        updateRecipe(data.key, data.val());
                        setRecipeBook(recipeBook);
                    }
                })
                onChildAdded(query(recipesRef, orderByChild("created"), limitToLast(1)), (data) => {
                    if (data.exists() && data.key && data.val()) {
                        updateRecipe(data.key, data.val());
                        setRecipeBook(recipeBook);
                    }
                })
                onChildRemoved(recipesRef, (data) => {
                    if (data.exists() && data.key && data.val()) {
                        recipeBook.deleteRecipe(data.val());
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
        <SettingsContext.Provider value={{ settings, setSettings }}>
            <UserContext.Provider value={user}>
                <RecipeBookStateContext.Provider value={recipeBookContextValue}>
                    {children}
                </RecipeBookStateContext.Provider>
            </UserContext.Provider>
        </SettingsContext.Provider>
    );
};

export const useUserState = () => React.useContext(UserContext);
export const useRecipeBookState = () => React.useContext(RecipeBookStateContext);
export const useSettingsState = () => React.useContext(SettingsContext);