


import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Recipe } from "../../../Models/Recipe";



interface SettingWidgetProps {
    title: string,
    subTitle?: string,
    icon: JSX.Element,
    onPress?: VoidFunction,
    rightIcon?: JSX.Element,
    roundUpperCorners?: boolean,
    roundBottomCorners?: boolean,
}



/**
 * Creates a customizable setting widget
 * @param SettingProps The properties of the widget
 */
export function SettingWidget({ title, subTitle, icon, onPress, rightIcon, roundUpperCorners=false, roundBottomCorners=false }: SettingWidgetProps) {
    const styles = createStyles();

    return (
        <View>
            <TouchableOpacity onPress={onPress} disabled={onPress === undefined} style={[styles.container, roundUpperCorners && styles.roundUpperCorners, roundBottomCorners && styles.roundBottomCorners]}>
                <View style={[styles.icon, styles.leftIcon]}>{icon}</View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    { subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
                </View>
                <View style={[styles.icon, styles.rightIcon]}>{rightIcon}</View>
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
        container: {

        },
        roundUpperCorners: {
            
        },
        roundBottomCorners: {

        },
        titleContainer: {

        },
        title: {

        },
        subTitle: {

        },
        icon: {

        },
        leftIcon: {

        },
        rightIcon: {

        }
    });
}
