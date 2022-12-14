import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";



/**
 * The creates a page where the user can view recipe posts from their friends
 * @param param0 The navigation used to navigate between screens
 */
export default function Social({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();

    return (
        <View style={globalStyles.screenContainer}>
            <Text variant="headlineLarge" >Social</Text>
        </View>
    );
}