import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useFeaturedRecipeState } from "../state";
import { Route } from "./navigation";



/**
 * This shows a recipe that is chosen everyday as the "featured recipe"
 * @param param0 The navigation to let the app navigate between screens
 */
export default function FeaturedRecipe({ route }: Route) {
    const { featuredRecipe } = useFeaturedRecipeState();
    const theme = useTheme();
    const colors = theme.colors;

    function handleViewRecipe() {
        route.navigation.navigate("Recipe", { recipe: featuredRecipe });
    }

    return (
        <View>
            <Text variant="headlineLarge" >Featured Recipe</Text>
            <Button onPress={handleViewRecipe}>View Recipe</Button>
        </View>
    );
}