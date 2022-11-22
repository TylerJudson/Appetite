import React from "react";
import { Text, useTheme } from "react-native-paper";


export default function FeaturedRecipe() {
    const theme = useTheme();
    const colors = theme.colors;


    return (
        <Text variant="headlineLarge" >Featured Recipe</Text>
    );
}