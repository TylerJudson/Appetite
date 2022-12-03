import React from "react";
import { Text, useTheme } from "react-native-paper";
import { Route } from "./navigation";

/**
 * Shows a list of the recipes for the user.
 * @param param0 the navigation so the user can navigate between screens
 */
export default function Recipes({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;

    return (
        <Text variant="headlineLarge" >Recipes</Text>
    );
}