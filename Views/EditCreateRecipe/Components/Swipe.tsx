
import React, { MutableRefObject, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { IconButton, Text, useTheme } from "react-native-paper";





/**
 * Creates a element that allows the user to swipe it to delete it
 * @param onSwipe the function to call when the user swipes the element
 * @param scrollRef The gestured scroll reference the swipe is in
 */
export function SwipeToDelete({ onSwipe, children, scrollRef }: {onSwipe: VoidFunction, children: React.ReactElement, scrollRef: MutableRefObject<ScrollView>}) {


    const translationX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const [shouldDelete, setShouldDelete] = useState(false);
    const [stopScroll, setStopScroll] = useState(false);

    const [width, setWidth] = useState(0);

    const panGesture = (event: any) => {
        'worklet';
        const isActive = event.nativeEvent.state === 4; // ACTIVE state
        const isEnd = event.nativeEvent.state === 5; // END state

        if (isActive) {
            translationX.value = event.nativeEvent.translationX > 0 ? 0 : event.nativeEvent.translationX;
            runOnJS(setShouldDelete)(translationX.value < 0.2 * -width);
            if (translationX.value != 0) {
                runOnJS(setStopScroll)(true);
            }
        } else if (isEnd) {
            if (shouldDelete) {
                translationX.value = withTiming(-width, undefined, (finished) => {
                    opacity.value = withTiming(0, undefined, (finished) => {
                        runOnJS(onSwipe)();

                        translationX.value = 0;
                        opacity.value = withTiming(1);
                    });
                });
            }
            else {
                runOnJS(setStopScroll)(false);
                translationX.value = withTiming(0);
            }
        }
    };


    const rstyles = useAnimatedStyle(() => ({
        transform: [
            {translateX: translationX.value}
        ],
    }))

    const rContainer = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))

    const styles = createStyles();

    return (
        <Animated.View style={rContainer}>
            <Animated.View style={[styles.deleteContainer]} onLayout={(event) => {setWidth(event.nativeEvent.layout.width)}}>
                <IconButton icon="trash-can-outline" size={shouldDelete ? 25 : 10} />
            </Animated.View>
            <PanGestureHandler simultaneousHandlers={stopScroll ? undefined :  scrollRef} onGestureEvent={panGesture}>
                <Animated.View style={rstyles}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    )
}





/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;
    return StyleSheet.create({
        deleteContainer: {
            backgroundColor: colors.errorContainer,
            position: "absolute", right: 0,
            height: "100%", width: "100%",
            justifyContent: "center", alignItems: "flex-end"
        }
    });
}
