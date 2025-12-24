


import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { Text, Surface, IconButton, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Recipe } from "../../../Models/Recipe";



interface SettingWidgetProps {
    title: string,
    subTitle?: string,
    icon: React.ReactElement,
    onPress?: VoidFunction,
    rightIcon?: React.ReactElement,
    roundUpperCorners?: boolean,
    roundBottomCorners?: boolean,
    danger?: boolean
}



/**
 * Creates a customizable setting widget
 * @param SettingProps The properties of the widget
 */
export function SettingWidget({ title, subTitle, icon, onPress, rightIcon, roundUpperCorners=false, roundBottomCorners=false, danger=false }: SettingWidgetProps) {
    const styles = createStyles();
    const colors = useTheme().colors;

    return (
        <View>
            <TouchableOpacity onPress={onPress} disabled={onPress === undefined} style={[styles.container, roundUpperCorners && styles.roundUpperCorners, roundBottomCorners && styles.roundBottomCorners]}>
                <View style={[styles.icon, styles.leftIcon]}>{icon}</View>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, danger && {color: colors.error}]} variant="labelLarge">{title}</Text>
                    { subTitle && <Text variant="bodySmall" style={styles.subTitle}>{subTitle}</Text>}
                </View>
                <View style={[styles.icon, styles.rightIcon]}>{rightIcon}</View>
                {!roundBottomCorners && <View style={styles.separator} />}
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
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            backgroundColor: colors.elevation.level4,
            flexDirection: 'row',
            overflow: "hidden"
        },
        roundUpperCorners: {
            borderTopLeftRadius: 10, borderTopRightRadius: 10
        },
        roundBottomCorners: {
            borderBottomLeftRadius: 10, borderBottomRightRadius: 10
        },
        titleContainer: {
            justifyContent: 'center',
            flex: 1
        },
        separator: {
            borderTopWidth: 1, borderColor: colors.outlineVariant, 
            width: "100%", 
            position: 'absolute', bottom: 0,
            marginLeft: 50
        },
        title: {
            fontSize: 15
        },
        subTitle: {
            color: colors.outline
        },
        icon: {
            alignSelf: 'center'
        },
        leftIcon: {

        },
        rightIcon: {
            alignSelf: "center",
        }
    });
}
