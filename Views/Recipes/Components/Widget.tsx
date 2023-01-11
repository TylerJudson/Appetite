import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
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
    const screenWidth = useWindowDimensions().width;

    return (
        <View style={{flex: 1 / Math.floor(screenWidth / 250)}}>
        <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut} >
            <TouchableOpacity onPress={onPress}>
                <Surface style={styles.container} elevation={3}>

                    {/** Image and title: */}
                    <Image style={styles.image} source={{uri: recipe.image ? recipe.image : undefined}} />
                    <Text style={styles.title} variant={screenWidth > 500 ? "titleLarge" : "titleMedium"}>{recipe.name}</Text>

                    {/** Heart icon */}
                    { recipe.favorited && <IconButton style={styles.heartIcon} icon="heart" size={30} /> }

                    {/** Chevron to the right on small screens. */}
                    { screenWidth <= 500 && <IconButton style={styles.chevronIcon} icon="chevron-right" size={40}/> }
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
            height: screenWidth > 500 ? undefined : 100,
            width: screenWidth > 500 ? undefined : "100%",
            aspectRatio: screenWidth > 500 ? 1 : undefined,
            borderRadius: 10,

        },
        title: {
            position: "absolute", bottom: 3, left: 10,
            paddingRight: 15
        },
        heartIcon: {
            position: "absolute", top: 0
        },
        chevronIcon: {
            position: "absolute", right: -10
        }
    });
}



export default memo(Widget, (prev, next) => {
    if (prev.recipe.name !== next.recipe.name || prev.recipe.image !== next.recipe.image || prev.recipe.favorited != next.recipe.favorited) {
        return false;
    }
    return true;
});