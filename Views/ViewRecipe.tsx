import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Appbar, Text, Tooltip, useTheme, Button } from "react-native-paper";
import { createGlobalStyles } from "./styles/globalStyles";
import { ViewRecipeHeader as Header } from "./components/Headers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";
import { ViewRecipeTimes as Times } from "./components/ViewRecipeTimes";
import { Recipe } from "../Models/Recipe";



type navProps = NativeStackScreenProps<RootStackParamList, 'Recipe'>;
/**
 * Shows a recipe to the user.
 * @param param0 The navigation and parameters (recipe) to navigate between screens and view the recipe
 */
export default function ViewRecipe({ navigation, route }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    return (
        <View style={globalStyles.container}>

            <Header navigation={navigation} recipe={route.params.recipe}/>

            <Image style={styles.image} source={{ uri: route.params.recipe.image }} />

            <Text variant="titleLarge" style={styles.title} >{route.params.recipe.name}</Text>

            <Times prepTime={route.params.recipe.prepTime} cookTime={route.params.recipe.cookTime} />

            <Text style={styles.title}>Description</Text>

            <Text variant="titleLarge" style={styles.title} >Ingredients</Text>

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
            padding: 10,
            paddingRight: 20
        },
        image: {
            width: "100%",
            height: 150,
            borderWidth: 1,
            borderColor: "blue"
        }
    });
}
