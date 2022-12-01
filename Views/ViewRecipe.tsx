import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Text, Tooltip, useTheme } from "react-native-paper";
import { createGlobalStyles } from "./styles/globalStyles";
import { ViewRecipeHeader as Header } from "./components/Headers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";






type navProps = NativeStackScreenProps<RootStackParamList, 'Recipe'>;
/**
 * Shows a recipe to the user.
 * @param param0 The navigation and parameters (recipe) to navigate between screens and view the recipe
 */
export default function ViewRecipe({ navigation, route }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyle = createGlobalStyles();


    return (
        <View style={globalStyle.container}>

            <Header navigation={navigation} recipe={route.params.recipe}/>            
            <Text variant="headlineLarge" >View Recipe</Text>


        </View>
    );
}