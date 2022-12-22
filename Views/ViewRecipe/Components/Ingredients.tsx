import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox, Text, useTheme } from "react-native-paper";


/**
 * Displays an ingredient that the user can mark off
 * @param ingredient The ingredient to display
 * @param index The index the ingredient appears
 */
export function Ingredients({ ingredient, index }: { ingredient: string, index: number }) {
    const styles = createStyles();
    const theme = useTheme();
    const colors = theme.colors;

    const [checked, setChecked] = useState(false);

    function toggleCheck() {
        setChecked(!checked);
    }

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: index % 2 ? colors.surfaceVariant : undefined }]} onPress={toggleCheck}>
            <Checkbox.Android
                status={checked ? 'checked' : 'unchecked'}
                onPress={toggleCheck}
            />
            <Text style={{textDecorationLine: checked ? "line-through" : "none", paddingRight: 30}} variant="bodyMedium" >{ingredient}</Text>
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
            padding: 10,
            flexDirection: "row", alignItems: "center"
        },
    });
}
