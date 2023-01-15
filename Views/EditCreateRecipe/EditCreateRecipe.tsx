import React, { MutableRefObject, useRef, useState } from "react";
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, useWindowDimensions } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useRecipeBookState, useUserState } from "../../state";
import { Recipe } from "../../Models/Recipe";
import { ScrollView } from "react-native-gesture-handler";
import { List } from "./Components/List";
import { Tags } from "../Recipes/Components/Tags";
import { ImageChooser } from "./Components/ImageChooser";
import { getDatabase, update, ref } from "firebase/database";
import { updateRecipe } from "../../FireBase/Update";

type navProps = NativeStackScreenProps<RootStackParamList, 'EditCreate'>;


/**
 * Displays a screen that allows the user to edit or create a recipe
 * @param navigation The navigation 
 * @param route The route params. This should include the recipe to edit (if there is one)
 */
export default function EditCreateRecipe({ navigation, route }: navProps) {
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const { recipeBook, setRecipeBook } = useRecipeBookState();
    const user = useUserState();

    const create = route.params.recipe ? false : true;
    const [recipe, setRecipe] = useState(route.params.recipe ? route.params.recipe.deepClone() : Recipe.Initial());
    const [tags, setTags] = useState<string[]>(recipe.tags);
    const [selectedImage, setSelectedImage] = useState(recipe.image);

    const scrollRef = useRef() as MutableRefObject<ScrollView>;

    /**
     * Handles the action of saving the recipe
     */
    function handleSave() {
        // If the recipe has no name display an alert saying that the user needs to include a name
        if (recipe.name === "") {
            if (Platform.OS === "web") {
                if (window.confirm("You must include a name before you can save the recipe.")) {
                }
            }
            else {
                return Alert.alert(
                    "",
                    "You must include a name before you can save the recipe.",
                    [
                        {
                            text: "Ok",
                            style: "cancel"
                        },
                    ]
                )
            }
        }
        else {
            recipe.image = selectedImage;
            recipe.tags = tags;

            recipeBook.recipes[recipe.id] = recipe;
            
            setRecipeBook(recipeBook);
            updateRecipe(user, recipe, create);

            navigation.goBack();
        }
    }

    /**
     * Displays an alert verifying the user wants to discard the recipe 
     */
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
                button={{label: create ? "Create" : "Save", onPress: handleSave}}
                leftButton={{label: "Cancel", onPress: handleBack }}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}} keyboardVerticalOffset={5}>
            <ScrollView ref={scrollRef}>
                <View style={styles.imageTitleContainer}>
                    <ImageChooser selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
                    
                    <View style={styles.titleContainer}>
                        <TextInput style={styles.oneLineTextInput} label="Recipe Name (required)"                                                   value={recipe.name}                 onChangeText={text => {recipe.name = text; setRecipe(recipe.clone())}}/>
                        <TextInput style={styles.oneLineTextInput} label="Description" multiline                              value={recipe.description || ""}    onChangeText={text => {recipe.description = text; setRecipe(recipe.clone())}}/>
                        <TextInput style={styles.oneLineTextInput} label="Prep Time"  placeholder="Prep Time (min)"           value={`${recipe.prepTime || ""}`}  onChangeText={text => {recipe.prepTime = parseInt(text); setRecipe(recipe.clone())}}/>
                        <TextInput style={styles.oneLineTextInput} label="Cook Time"  placeholder="Prep Time (min)"           value={`${recipe.cookTime || ""}`}  onChangeText={text => {recipe.cookTime = parseInt(text); setRecipe(recipe.clone())}}/>
                    </View>
                </View>


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
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        oneLineTextInput: {
            marginVertical: 10
        },
        imageTitleContainer: {
            flexDirection: screenWidth > 700 ? "row" : undefined
        },
        titleContainer: {
            flex: 1,
            margin: screenWidth > 700 ? 10 : undefined,
            justifyContent: screenWidth > 700 ? "space-between" : undefined,
        },
    }); 
}
