import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Searchbar, Text } from "react-native-paper";
import { Route } from "./navigation";
import { RecipesHeader as Header } from "./components/Headers";
import { useRecipeBookState } from "../state";
import { RecipeWidget } from "./components/RecipeWidget";
import { createGlobalStyles } from "./styles/globalStyles";
import { filterObject } from "../utilities/filter";
import { Recipe } from "../Models/Recipe";
/**
 * Shows a list of the recipes for the user.
 * @param param0 the navigation so the user can navigate between screens
 */
export default function Recipes({ route }: Route) {
    const { recipeBook } = useRecipeBookState();

    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const [viewFavorites, setViewFavorites] = useState(false); // TODO: Docume
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredRecipes, setFilteredRecipes] = useState(recipeBook.recipes);

    function filter() {
        setFilteredRecipes(filterObject(recipeBook.recipes, (recipe: Recipe) => {
            let ret = true;
            if (viewFavorites) {
                ret = recipe.favorited;
            }
            if (tags) {
                // ret = ret && recipe.tags.includes(tags[0]) // TODO: fix
            }
            if (search != "") {
                ret = ret && recipe.name.toUpperCase().indexOf(search.toUpperCase()) > -1;
            }
            return ret;
        }));
    }

    useEffect(filter, [recipeBook, viewFavorites, search, tags]);


    function handleSearchChange(value: string) {
        setSearch(value);
    }


    return (
        <View style={globalStyles.container}>
            <Header value={viewFavorites} setValue={setViewFavorites}/>

            <ScrollView>
                <Text style={styles.title} variant="headlineLarge" >Recipes</Text>

                <Searchbar style={styles.searchBar} placeholder="Search" onChangeText={handleSearchChange} value={search} />

                <View>
                    {
                        Object.values(filteredRecipes).sort(sortAlpha).map((recipe, index) => {
                            return (
                                <RecipeWidget key={index} recipe={recipe} onPress={() => route.navigation.navigate("Recipe", {recipe: recipe})}/>
                            )
                        })
                    }
                </View>

            </ScrollView>

        </View>
    );
}



/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        title: {
            margin: 10
        },
        searchBar: {
            marginHorizontal: 10
        }
    });
}




function sortAlpha(a: Recipe, b: Recipe) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}