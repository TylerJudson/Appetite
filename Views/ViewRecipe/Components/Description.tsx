import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";


/**
 * Creates a description with a show more button
 * @param description The description of the recipe
 */
export function Description({ description }: { description?: string }) {
    const theme = useTheme();
    const colors = theme.colors;
    const styles = createStyles();

    const screenWidth = useWindowDimensions().width;
    const screenIsBig = screenWidth > 700;

    const [more, setMore] = useState(false);

    /** Toggles the more content */
    function toggleMore() {
        setMore(!more);
    }

    // If there is no description don't display anything.
    if (description === "") {
        return <></>
    }

    return (
        <View style={styles.container}>
            <Text variant="titleMedium">Description</Text>
            <Text style={{paddingHorizontal: 10}} variant="bodyMedium" numberOfLines={more ? undefined : screenIsBig ? 5 : 1}>{description}</Text>
            <Text style={{paddingHorizontal: 10, color: colors.secondary}} variant="bodySmall" onPress={toggleMore}>{more ? "Show Less ▲" : "Show More ▼"}</Text>
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
            padding: 10, paddingHorizontal: 20
        },
    });
}
