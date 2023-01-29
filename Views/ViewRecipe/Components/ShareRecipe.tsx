import { getDatabase, ref, set } from "firebase/database";
import React, {  } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { TouchableRipple, Menu } from "react-native-paper";
import { Recipe } from "../../../Models/Recipe";


/**
 * Displays a view that allows the user to share a recipe
 * @param recipe The recipe to share
 */
export function ShareRecipe({ recipe, hideModal }: { recipe: Recipe, hideModal: VoidFunction }) {
    
    /**
     * Handles the action of the user clicking the create post option
     */
    function handleCreatePost() {
        console.log("Not yet implemented");
        hideModal();
    }
    /**
     * Handles the action of the user clicking on the share pdf option
     */
    function handleSharePdf() {
        console.log("Not yet implemented");
        hideModal();
    }

    /**
     * Handles the action of the user clicking on the publish recipe
     */
    function handlePublish() {

        if (Platform.OS === "web") {
            if (window.confirm(`Publish Recipe? \n Are you sure you want to publish this recipe?`)) {
                publishRecipe();
            }
        }
        else {
            return Alert.alert(
                "Publish Recipe?",
                `Are you sure you want to publish this recipe?`,
                [
                    {
                        text: "Yes",
                        style: "cancel",
                        onPress: publishRecipe
                    },
                    {
                        text: "No",
                        style: "destructive"
                    },
                ]
            )
        }
       
    }


    function publishRecipe() {
        hideModal();
        const db = getDatabase();
        // Send data to the database
        set(ref(db, 'publicRecipes/shallow/' + recipe.id), {
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            tags: recipe.tags,
        });
        const sendRecipe = recipe.onlyDefinedProperties();
        delete sendRecipe["favorited"];
        set(ref(db, 'publicRecipes/deep/' + recipe.id), sendRecipe);

        if (Platform.OS === "web") {
            if (window.confirm(`Recipe Published \n Your recipe was successfully published.`)) {
            }
        }
        else {
            return Alert.alert(
                "Recipe Published",
                `Your recipe was successfully published.`,
                [
                    {
                        text: "Okay",
                        style: "cancel",
                    }
                ]
            )
        }
    }

    return (
        <View style={{ padding: 10 }}>
            <TouchableRipple onPress={handleCreatePost}>
                <Menu.Item leadingIcon="post" title="Create a Post" />
            </TouchableRipple>
            <TouchableRipple onPress={handleSharePdf} >
                <Menu.Item leadingIcon="file" title="Share Pdf" />
            </TouchableRipple>
            <TouchableRipple onPress={handlePublish} >
                <Menu.Item leadingIcon="upload" title="Publish Recipe" />
            </TouchableRipple>
        </View>
    );
}