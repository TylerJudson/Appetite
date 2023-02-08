import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Text, Surface, Button, useTheme } from "react-native-paper";





/**
 * Displays a clickable recipe card with the picture of a recipe on it and the title and description.
 * @param title The title of the recipe
 * @param description The description of the recipe
 * @param image The image of the recipe
 * @param onPress The function to call when the user presses on the card
 * @param onAdd The function to call when the user clicks on the add button
 */
export function TagCard({ title, onPress, image, linearGradientProps }: { title: string, onPress: VoidFunction, image?: ImageSourcePropType, linearGradientProps?: LinearGradientProps }) {
    const styles = createStyles();
    const colors = useTheme().colors;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Surface style={styles.surfaceContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title} variant="titleMedium" numberOfLines={1} >{title}</Text>
                </View>
                    {
                        image && !linearGradientProps && <Image style={styles.background} source={image} />
                    }
                    {
                        linearGradientProps && !image && <LinearGradient style={styles.background} {...linearGradientProps} />
                    }
                    {
                        !linearGradientProps && !image && <LinearGradient style={styles.background} colors={[colors.inversePrimary, colors.secondaryContainer]} start={{x: 0, y: 0}} end={{x: 1, y: 1}}/>
                    }
                    <View style={[styles.background, {backgroundColor: "rgba(0, 0, 0, 0.1)"}]} />
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
            borderRadius: 10
        },
        surfaceContainer: {
            borderRadius: 10
        },
        contentContainer: {
            padding: 15, borderRadius: 10, alignItems: 'center', 
            zIndex: 1
        },
        title: {
            width: "100%",
            textAlign: 'center',
            fontWeight: "700", textShadowColor: "#000", textShadowRadius: 5,
            color: "#fff"
        },
        background: {
            position: "absolute", width: "100%", height: "100%", borderRadius: 10,
        }
    });
}