import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Searchbar, Text } from "react-native-paper";
import { Route } from "./navigation";
import { RecipeHeader as Header } from "./components/Headers";
import { useRecipeBookState } from "../state";
import { RecipeWidget } from "./components/RecipeWidget";
import { createGlobalStyles } from "./styles/globalStyles";
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

    const [viewAllRecipes, setViewAllRecipes] = useState("All Recipes"); // TODO: Docume
    const [search, setSearch] = useState("");

    function handleSearchChange(value: string) {
        setSearch(value);
    }


    return (
        <View style={globalStyles.container}>
            <Header value={viewAllRecipes} setValue={setViewAllRecipes}/>

            <ScrollView>
                <Text style={styles.title} variant="headlineLarge" >Recipes</Text>

                <Searchbar style={styles.searchBar} placeholder="Search" onChangeText={handleSearchChange} value={search} />

                <View>
                    {
                        Object.values(recipeBook.recipes).map((recipe, index) => {
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
