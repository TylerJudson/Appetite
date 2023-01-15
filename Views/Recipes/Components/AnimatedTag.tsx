import React from "react";
import { Chip } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


/**
 * Displays a tag that is animated
 * @param title The title to show on the tag
 * @param onPress The function to call when the user clicks on the tag
 * @param remove Whether or not to show the remove button
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

