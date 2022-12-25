import React from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useRecipeBookState } from "../../state";
import { Recipe } from "../../Models/Recipe";

type navProps = NativeStackScreenProps<RootStackParamList, 'EditCreate'>;
/**
 * Shows a recipe to the user.
 * @param param0 The navigation and parameters (recipe) to navigate between screens and view the recipe
 */
export default function EditCreateRecipe({ navigation, route }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const { recipeBook } = useRecipeBookState();

    let recipe: Recipe | undefined = undefined;
    if (route.params.recipeId) {
        recipe = recipeBook.recipes[route.params.recipeId];
    }

    function handleBack() {

        if (Platform.OS === "web") {
            if (window.confirm("Discard Recipe? \nChanges to this recipe will not be saved.")) {
                navigation.goBack();
            }
        }
        else {
            return Alert.alert(
                "Discard Recipe?",
                "Changes to this recipe will not be saved.",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Discard",
                        onPress: () => navigation.goBack(),
                        style: "destructive"
                    }
                ]
                )
        }
    }

    return (
        <View style={globalStyles.container}>

            <Header
                title={recipe ? "Edit" : "Create Recipe"} 
                button={{label: recipe ? "Save" : "Create", onPress: () => console.log("Not yet Implemented")}}
                leftButton={{label: "Cancel", onPress: handleBack }}
            />

            <ScrollView>



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
        
    });
}
