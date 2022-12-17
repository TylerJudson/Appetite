import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";


/**
 * Displays the tags for a recipe. // TODO: Docs
 * @param tags The tags to display for the recipe
 */
export function RecipeWidget({ recipe, onPress }: { recipe: Recipe, onPress: VoidFunction }) {
    const styles = createStyles();

    return (
        <TouchableOpacity onPress={onPress}>
            <Surface style={styles.container} elevation={3}>
                <Image style={styles.image} />
                <Text style={styles.title} variant="titleMedium">{recipe.name}</Text>
                <IconButton style={styles.icon} icon="chevron-right" size={40}/>
            </Surface>
        </TouchableOpacity>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        container: {
            marginBottom: 15, marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
        },
        image: {
            height: 100
        },
        title: {
            position: "absolute", bottom: 3, left: 10
        },
        icon: {
            position: "absolute", right: -10
        }
    });
}
