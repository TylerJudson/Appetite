import React, {  } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableRipple, Menu } from "react-native-paper";
import { Recipe } from "../../../Models/Recipe";


/**
 * Displays a view that allows the user to share a recipe
 * @param recipe The recipe to share
 */
export function ShareRecipe({ recipe }: { recipe: Recipe }) {
    
    /**
     * Handles the action of the user clicking the create post option
     */
    function handleCreatePost() {
        console.log("Not yet implemented");
    }
    /**
     * Handles the action of the user clicking on the share pdf option
     */
    function handleSharePdf() {
        console.log("Not yet implemented");
    }


    return (
        <View style={{ padding: 10 }}>
            <TouchableRipple onPress={handleCreatePost}>
                <Menu.Item leadingIcon="post" title="Create a Post" />
            </TouchableRipple>
            <TouchableRipple onPress={handleSharePdf} >
                <Menu.Item leadingIcon="file" title="Share Pdf" />
            </TouchableRipple>
        </View>
    );
}