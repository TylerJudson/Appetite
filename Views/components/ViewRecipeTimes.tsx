import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Button, Text } from "react-native-paper";


/**
 * Creates a header with a back button and controls for the recipe
 * @param param0 The navigation and recipe
 */
export function ViewRecipeTimes({ prepTime, cookTime }: { prepTime?: number, cookTime?: number }) {
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

    return StyleSheet.create({
        container: {
            flexDirection: "row", justifyContent: "space-around",
            maxWidth: 450,
            transform: [{scale: screenWidth < 400 ? screenWidth / 400 : 1}]
        },
        button: {
            transform: [{scale: 0.9}]            
        }
    });
}
