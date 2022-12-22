import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Button, Text } from "react-native-paper";


/**
 * Displays the prep, cook, and total time for a recipe.
 * @param prepTime The time it takes to prep the recipe.
 * @param cookTime The time it takes to cook the recip.
 */
export function Times({ prepTime, cookTime }: { prepTime?: number, cookTime?: number }) {
    const styles = createStyles();

    return (
        <View style={styles.container}>
            {
                prepTime &&
                <Button style={styles.button} mode="outlined" icon="clock-time-two-outline">Prep: {prepTime}m</Button>
            }
            {
                cookTime &&
                <Button style={styles.button} mode="outlined"  icon="clock-outline">Cook: {cookTime}m</Button>
            }
            {
                prepTime && cookTime &&
                <Button style={styles.button} mode="outlined" icon="timelapse">Total: {prepTime + cookTime}m</Button>
            }
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;
    const screenIsBig = screenWidth > 700;

    const shouldShrinkContainer = screenWidth < 400 || (700 < screenWidth && screenWidth < 850);
    const shrink = screenWidth < 400 
                    ? screenWidth / 400
                    : shouldShrinkContainer
                        ? (screenWidth - 450) / (800 - 400)
                        : 1; 

    return StyleSheet.create({
        container: {
            flexDirection: "row", justifyContent: "space-around",
            maxWidth: 450,
            transform: [{scale: shrink}],
            marginVertical: screenIsBig ? 15 : undefined
        },
        button: {
            transform: [{scale: 0.9}]            
        }
    });
}
