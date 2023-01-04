import React from "react";
import { Chip } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


// TODO: Docs
/**
 * Displays a clickable widget with the picture of a recipe on it.
 * @param recipe The recipe to display on the widget
 * @param onPress The function to call when the user presses on the widget
 */
export function AnimatedTag({ title, onPress, remove=false }: { title: string, onPress: VoidFunction, remove?: boolean }) {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ margin: 3 }}>
            <Chip
                compact
                elevated
                onClose={remove ? onPress : undefined}
                onPress={onPress}
            >
                {title}
            </Chip>
        </Animated.View>
    );
}

