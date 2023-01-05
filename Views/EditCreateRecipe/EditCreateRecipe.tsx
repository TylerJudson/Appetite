import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { TextInput, useTheme, Text, IconButton, Chip } from "react-native-paper";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useRecipeBookState } from "../../state";
import { Recipe } from "../../Models/Recipe";

type navProps = NativeStackScreenProps<RootStackParamList, 'EditCreate'>;


// TODO: docs
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

    const [recipe, setRecipe] = useState(route.params.recipe ? route.params.recipe.clone() : Recipe.Initial());
    const [newIngredient, setNewIngredient] = useState("");

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

    function submitNewIngredient(index: number = -1) {
        recipe.ingredients.push(newIngredient);
        setNewIngredient("");
        setRecipe(recipe.clone());
    }

    return (
        <View style={globalStyles.container}>

            <Header
                title={recipe ? "Edit" : "Create Recipe"} 
                button={{label: recipe ? "Save" : "Create", onPress: () => console.log("Not yet Implemented")}}
                leftButton={{label: "Cancel", onPress: handleBack }}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
            <ScrollView>
                <View style={{ width: "100%", height: 300, borderWidth: 1, borderColor: "#f0f" }}></View>

                <TextInput style={styles.oneLineTextInput} label="Recipe Name"                                                   value={recipe.name}                 onChangeText={text => {recipe.name = text; setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Description (optional)" multiline                              value={recipe.description || ""}    onChangeText={text => {recipe.description = text; setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Prep Time (optional)"  placeholder="Prep Time (min)"           value={`${recipe.prepTime || ""}`}  onChangeText={text => {recipe.prepTime = parseInt(text); setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Cook Time (optional)"  placeholder="Prep Time (min)"           value={`${recipe.cookTime || ""}`}  onChangeText={text => {recipe.cookTime = parseInt(text); setRecipe(recipe.clone())}}/>

                <Text variant="titleLarge">Ingredients:</Text>
                <View>
                    {
                        recipe.ingredients.map((ingredient, index) => {
                            return (
                                <View key={index} style={styles.listContainer}>
                                    <TextInput left={<TextInput.Icon icon="square-outline" />} style={styles.listInput} dense value={ingredient} />
                                </View>
                            )
                        })
                    }
                </View>

                <TextInput left={<TextInput.Icon icon="plus" />} style={styles.listInput} dense value={newIngredient} onChangeText={text => setNewIngredient(text)} onSubmitEditing={() => submitNewIngredient()} />


                <Text variant="titleLarge">Instructions:</Text>
                <IconButton icon="plus" />

                <Text>Tags: </Text>
                <Chip>New Tag</Chip>
                <TextInput label="Add Tag" />
            </ScrollView>
            </KeyboardAvoidingView>

        </View>
    );
}



/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        oneLineTextInput: {
            marginVertical: 10
        },
        listContainer: {
            flexDirection: 'row'
        },
        listInput: {
            flex: 1
        }
    }); 
}
