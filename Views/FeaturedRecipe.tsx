import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { Recipe } from "../Models/Recipe";
import { RootStackParamList } from "./navigation";



const featuredRecipe = new Recipe(
    "Pizza",
    [""],
    [""],
    10,
    20,
    [],
    true
);



type navProps = NativeStackScreenProps<RootStackParamList, 'Appetite'>;
/**
 * This shows a recipe that is chosen everyday as the "featured recipe"
 * @param param0 The navigation to let the app navigate between screens
 */
export default function FeaturedRecipe({navigation}: navProps) {
    const theme = useTheme();
    const colors = theme.colors;

    return (
        <View>
            <Text variant="headlineLarge" >Featured Recipe</Text>
            <Button onPress={() => navigation.navigate("Recipe", {recipe: featuredRecipe})}>View Recipe</Button>
        </View>
    );
}


