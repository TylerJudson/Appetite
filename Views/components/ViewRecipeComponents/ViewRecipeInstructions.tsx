import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import { Button, Checkbox, Text, useTheme } from "react-native-paper";


/**
 * Displays the prep, cook, and total time for a recipe. // TODO: docs
 * @param prepTime The time it takes to prep the recipe.
 * @param cookTime The time it takes to cook the recip.
 */
export function ViewRecipeInstructions({ instruction, index }: { instruction: string, index: number }) {
    const styles = createStyles();
    const theme = useTheme();
    const colors = theme.colors;

    const [checked, setChecked] = useState(false);

    function toggleCheck() {
        setChecked(!checked);
    }

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: index % 2 ? colors.backdrop : undefined }]} onPress={toggleCheck}>
            <Text key={index} style={{ textDecorationLine: checked ? "line-through" : "none" }} variant="bodyLarge" >
                {index + 1}. {instruction}
            </Text>
        </TouchableOpacity>
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
            padding: 10,
            flexDirection: "row", alignItems: "center"
        },
    });
}
