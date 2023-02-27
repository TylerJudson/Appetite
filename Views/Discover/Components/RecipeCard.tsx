import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
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
    const [added, setAdded] = useState(false);
    const styles = createStyles();

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Surface style={styles.surfaceContainer} elevation={4} >
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: image ? image : undefined }} />
                        <Button icon={added ? "check" : "plus"} style={styles.addButton} mode="contained" onPress={() => {onAdd(); setAdded(true)}}>Save{added ? "d" : ""}</Button>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title} variant="titleMedium" numberOfLines={1} >{title}</Text>
                        <Text style={styles.description} numberOfLines={3} >{description}</Text>
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
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        container: {
            width: screenWidth / 2, marginLeft: 10, margin: 5,
            maxWidth: 375
        },
        surfaceContainer: {
            borderRadius: 10
        },
        imageContainer: {
            width: "100%",
        },
        image: {
            width: "100%",
            height: screenWidth / 3 > 250 ? 250 : screenWidth / 3,
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
            margin: 5,
            fontWeight: "600",
            fontSize: 18
        },
        description: {
        },
    });
}