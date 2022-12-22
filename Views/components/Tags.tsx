import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, Portal, Modal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/**
 * Displays all the tags that the user can select to filter the recipes
 * @param tags The current tags set to filter
 * @param setTags the function to set the tags to filter
 */
export function Tags({ tags, setTags }: { tags: string[], setTags: Dispatch<SetStateAction<string[]>> }) {
    const styles = createStyles();

    return (
        <View style={styles.container}>
            <Text>This is not yet implemented</Text>
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
            width: 300,
            height: 200
        },
    });
}
