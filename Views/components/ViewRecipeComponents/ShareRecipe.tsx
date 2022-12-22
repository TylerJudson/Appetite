import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, Portal, Modal, TouchableRipple, Menu } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../../Models/Recipe";


/**
 * Displays all the tags that the user can select to filter the recipes
 * @param tags The current tags set to filter
 * @param setTags the function to set the tags to filter
 */
export function ShareRecipe({ recipe }: { recipe: Recipe }) {
    const styles = createStyles();
    
    // TODO: DOcs
    function handleCreatePost() {
        console.log("Not yet implemented");
    }
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


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        
    });
}
