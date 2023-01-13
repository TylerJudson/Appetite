


import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Recipe } from "../../../Models/Recipe";



interface SettingWidgetProps {
    title: string,
    icon: JSX.Element,
    onPress?: VoidFunction,
    rightIcon?: JSX.Element,
    roundUpperCorners?: boolean,
    roundBottomCorners?: boolean,
}



// TODO: docs
/**
 * Displays a clickable widget with the picture of a recipe on it.
 * @param recipe The recipe to display on the widget
 * @param onPress The function to call when the user presses on the widget
 */
export function SettingWidget({ title, icon, onPress, rightIcon, roundUpperCorners=false, roundBottomCorners=false }: SettingWidgetProps) {
    const styles = createStyles();

    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                {
                    icon
                }
                <Text>{title}</Text>
                {
                    rightIcon
                }
            </TouchableOpacity>
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        
    });
}
