import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Snackbar, Surface, Text, useTheme } from "react-native-paper";
import { createGlobalStyles } from "./styles/globalStyles";
import { BackHeader as Header } from "./components/Headers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";

type navProps = NativeStackScreenProps<RootStackParamList, 'EditCreate'>;
/**
 * Shows a recipe to the user.
 * @param param0 The navigation and parameters (recipe) to navigate between screens and view the recipe
 */
export default function EditCreateRecipe({ navigation, route }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();


    function handleBack() {
        return Alert.alert(
            "Discard Recipe?",
            "Changes to this recipe will not be saved.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Discard",
                    onPress: () => navigation.goBack(),
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <View style={globalStyles.container}>

            <Header navigation={navigation} 
                title={route.params.recipe ? "Edit" : "Create Recipe"} 
                button={{label: route.params.recipe ? "Save" : "Create", onPress: () => console.log("Not yet Implemented")}}
                leftButton={{label: "Cancel", onPress: handleBack }}
            />

            <ScrollView>



            </ScrollView>

        </View>
    );
}



/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        
    });
}
