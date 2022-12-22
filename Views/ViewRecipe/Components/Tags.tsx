import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";


/**
 * Displays the tags for a recipe.
 * @param tags The tags to display for the recipe
 */
export function Tags({ tags }: { tags: string[] }) {
    const styles = createStyles();

    // If the tags are empty don't display anything
    if (tags.length == 0) {
        return <></>
    }

    return (
        <View style={styles.container}>
            <Text variant="titleMedium">Tags</Text>
            <View style={styles.tagContainer}>
                {
                    tags.map((tag, index) => {
                        return <Chip key={index} compact style={styles.tag} >{tag}</Chip>
                    })
                }
            </View>
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        container: {
            padding: 10, paddingHorizontal: 20,
        },
        tagContainer: {
            flexDirection: "row", flexWrap: "wrap",
            marginTop: 5, marginBottom: 30
        },
        tag: {
            margin: 3
        }
    });
}
