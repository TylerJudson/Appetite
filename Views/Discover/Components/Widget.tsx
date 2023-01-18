import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Recipe } from "../../../Models/Recipe";




// TODO: Docs



/**
 * Displays a clickable widget with the picture of a recipe on it.
 * @param recipe The recipe to display on the widget
 * @param onPress The function to call when the user presses on the widget
 */
export function Widget({ recipeId, title, image, onPress }: { recipeId: string, title: string, image: string, onPress: VoidFunction }) {
    const styles = createStyles();
    const screenWidth = useWindowDimensions().width;

    return (
        <View style={{ flex: 1 }}>
            <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut} >
                <TouchableOpacity onPress={onPress}>
                    <Surface style={styles.container} elevation={3}>

                        {/** Image and title: */}
                        <Image style={styles.image} source={{ uri: image ? image : undefined }} />

                        {/** The linear gradient if there is an image */}
                        {
                            image &&
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.75)']}
                                style={styles.gradient}
                            />
                        }

                        <Text style={[styles.title, { color: image || useTheme().dark ? "#fff" : "#000" }]} variant={screenWidth > 500 ? "titleLarge" : "titleMedium"}>{title}</Text>

                        {/** Chevron to the right on small screens. */}
                        {screenWidth <= 500 && <IconButton style={styles.chevronIcon} icon="chevron-right" size={40} />}

                    </Surface>
                </TouchableOpacity>
            </Animated.View>
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
            marginBottom: 15, marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
        },
        image: {
            height: 100,
            width: "100%",
            borderRadius: 10,

        },
        title: {
            position: "absolute", bottom: 3, left: 10,
            paddingRight: 15
        },
        chevronIcon: {
            position: "absolute", right: -10
        },
        gradient: {
            position: 'absolute',
            width: '100%', height: "50%",
            bottom: 0,
            borderBottomRightRadius: 10, borderBottomLeftRadius: 10,
        }
    });
}