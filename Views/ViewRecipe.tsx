import React from "react";
import { Text, useTheme } from "react-native-paper";


export default function ViewRecipe() {
    const theme = useTheme();
    const colors = theme.colors;



    return (
        <Text variant="headlineLarge" >View Recipe</Text>
    );
}