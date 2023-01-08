import React, { MutableRefObject, useRef, useState } from "react";
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, TextInput as Input } from "react-native";
import { TextInput, useTheme, Text, IconButton, Chip } from "react-native-paper";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useRecipeBookState } from "../../state";
import { Recipe } from "../../Models/Recipe";
import { SwipeToDelete } from "./Components/Swipe";
import { ScrollView } from "react-native-gesture-handler";
import { List } from "./Components/List";
import { Tags } from "../Recipes/Components/Tags";

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

    const create = route.params.recipe ? false : true;
    const [recipe, setRecipe] = useState(route.params.recipe ? route.params.recipe.clone() : Recipe.Initial());
    const [tags, setTags] = useState<string[]>(recipe.tags); // The tags to filter the list of recipes by

    const scrollRef = useRef() as MutableRefObject<ScrollView>;


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
                title={create ? "Create Recipe" : "Edit"} 
                button={{label: create ? "Create" : "Save", onPress: () => console.log("Not yet Implemented")}}
                leftButton={{label: "Cancel", onPress: handleBack }}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}} keyboardVerticalOffset={5}>
            <ScrollView ref={scrollRef}>
                <View style={{ width: "100%", height: 200, borderWidth: 1, borderColor: "#f0f" }}></View>

                <TextInput style={styles.oneLineTextInput} label="Recipe Name"                                                   value={recipe.name}                 onChangeText={text => {recipe.name = text; setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Description" multiline                              value={recipe.description || ""}    onChangeText={text => {recipe.description = text; setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Prep Time"  placeholder="Prep Time (min)"           value={`${recipe.prepTime || ""}`}  onChangeText={text => {recipe.prepTime = parseInt(text); setRecipe(recipe.clone())}}/>
                <TextInput style={styles.oneLineTextInput} label="Cook Time"  placeholder="Prep Time (min)"           value={`${recipe.cookTime || ""}`}  onChangeText={text => {recipe.cookTime = parseInt(text); setRecipe(recipe.clone())}}/>

                <List 
                    title={"Ingredients:"}
                    list={recipe.ingredients}
                    onDelete={(index) => { recipe.ingredients.splice(index, 1); setRecipe(recipe.clone()) }}
                    onItemChange={(text, index) => { recipe.ingredients[index] = text; setRecipe(recipe.clone()) }}
                    onAdd={value => { recipe.ingredients.push(...value.split("\n")); setRecipe(recipe.clone()) }}
                    addPlaceholder="Add Ingredient..."
                    scrollRef={scrollRef}
                    affix="Checks"
                />

                <List
                    title={"Instructions:"}
                    list={recipe.instructions}
                    onDelete={(index) => { recipe.instructions.splice(index, 1); setRecipe(recipe.clone()) }}
                    onItemChange={(text, index) => { recipe.instructions[index] = text; setRecipe(recipe.clone()) }}
                    onAdd={value => { recipe.instructions.push(...value.split("\n")); setRecipe(recipe.clone()) }}
                    addPlaceholder="Add Instruction..."
                    scrollRef={scrollRef}
                    multiline
                />

                <View style={{ marginVertical: 20 }}/>
                <Tags title="Tags" tags={tags} setTags={setTags} addTags />
                <View style={{ marginVertical: 75 }} />

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
    const colors = useTheme().colors;
    return StyleSheet.create({
        oneLineTextInput: {
            marginVertical: 10
        },
    }); 
}
