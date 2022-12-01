import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import { RootStackParamList } from "./navigation";


type navProps = NativeStackScreenProps<RootStackParamList, 'Appetite'>;
/**
 * Shows a list of the recipes for the user.
 * @param param0 the navigation so the user can navigate between screens
 */
export default function Recipes({ navigation }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;

    return (
        <Text variant="headlineLarge" >Recipes</Text>
    );
}