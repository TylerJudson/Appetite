import React from "react";
import { Text, useTheme } from "react-native-paper";


export default function Social() {
    const theme = useTheme();
    const colors = theme.colors;


    return (
        <Text variant="headlineLarge" >Social</Text>
    );
}