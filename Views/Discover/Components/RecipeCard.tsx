import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, Surface, Button } from "react-native-paper";





/**
 * Displays a clickable recipe card with the picture of a recipe on it and the title and description.
 * @param title The title of the recipe
 * @param description The description of the recipe
 * @param image The image of the recipe
 * @param onPress The function to call when the user presses on the card
 * @param onAdd The function to call when the user clicks on the add button
 */
export function RecipeCard({ title, description, image, onPress, onAdd }: { title: string, description: string, image: string, onPress: VoidFunction, onAdd: VoidFunction }) {
    const styles = createStyles();

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Surface style={styles.surfaceContainer} elevation={4} >
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} />
                        <Button icon={"plus"} style={styles.addButton} mode="contained" onPress={onAdd}>Save</Button>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title} variant="titleLarge" >{title}Title</Text>
                        <Text style={styles.description} numberOfLines={3} >{description}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    </View>
                </Surface>
            </TouchableOpacity>
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        container: {
            width: 225, marginLeft: 10, margin: 5
        },
        surfaceContainer: {
            borderRadius: 10
        },
        imageContainer: {
            width: "100%",
            height: 150
        },
        image: {
            width: "100%",
            height: 150,
            borderWidth: 1, borderColor: "#003",
            borderRadius: 10,
        },
        addButton: {
            position: 'absolute', right: 0, bottom: 5,
            transform: [{scale: 0.8}]
        },
        textContainer: {
            height: 100, margin: 10
        },
        title: {
            margin: 5
        },
        description: {
        },
    });
}