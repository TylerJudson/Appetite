
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { runOnJS, timing, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { IconButton, Text, useTheme } from "react-native-paper";
import { MutableRefObject, useState } from 'react';




// TODO: Docs

/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function SwipeToDelete({ onSwipe, children, scrollRef }: {onSwipe: VoidFunction, children: JSX.Element, scrollRef: MutableRefObject<ScrollView>}) {


    const translationX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const [shouldDelete, setShouldDelete] = useState(false);
    const [stopScroll, setStopScroll] = useState(false);

    const [width, setWidth] = useState(0);

    const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onActive: (event) => {
            translationX.value = event.translationX > 0 ? 0 : event.translationX;
            runOnJS(setShouldDelete)(translationX.value < 0.2 * -width);
            if (translationX.value != 0) {
                runOnJS(setStopScroll)(true);
            }
        },
        onEnd: () => {
            if (shouldDelete) {
                translationX.value = withTiming(-width, undefined, () => {
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
    });


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
