import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import { RootStackParamList, Route } from "./navigation";

type navProps = NativeStackScreenProps<RootStackParamList, 'Appetite'>;
/**
 * The creates a page where the user can view recipe posts from their friends
 * @param param0 The navigation used to navigate between screens
 */
export default function Social({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;

    return (
        <Text variant="headlineLarge" >Social</Text>
    );
}