import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Recipe } from "../../../Models/Recipe";

/**
 * Displays a clickable widget with the picture of a recipe on it.
 * @param recipe The recipe to display on the widget
 * @param onPress The function to call when the user presses on the widget
 */
export function Widget({ recipe, onPress }: { recipe: Recipe, onPress: VoidFunction }) {
    const styles = createStyles();

    return (
        <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut} >
            <TouchableOpacity onPress={onPress}>
                <Surface style={styles.container} elevation={3}>
                    <Image style={styles.image} />
                    <Text style={styles.title} variant="titleMedium">{recipe.name}</Text>
                    <IconButton style={styles.icon} icon="chevron-right" size={40}/>
                </Surface>
            </TouchableOpacity>
        </Animated.View>
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
