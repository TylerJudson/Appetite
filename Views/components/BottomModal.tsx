import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/**
 * Displays a modal at the bottom of the screen
 * @param visible Whether the modal is visible or not
 * @param setVisible the function to set the visibility
 */
export function BottomModal({ visible, setVisible, children }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, children: React.ReactNode }) {
    const styles = createStyles();
    const [isVisible, setIsVisible] = useState(false);

    const [height, setHeight] = useState(1000);

    const animModal = useRef(new Animated.Value(0)).current;
    const modalRef = useRef<View>(null) as MutableRefObject<View>;

    /**
     * Hides the modal by displaying the hide animation.
     */
    function hideModal() {
        Animated.timing(
            animModal,
            {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }
            ).start(() => setIsVisible(false));
    }

    useEffect(() => {
        if (visible) {
            setIsVisible(true)
            Animated.timing(
                animModal,
                {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true
                }
                ).start()
        }
        else if (isVisible) {
            hideModal();
        }

    }, [visible])

    return (
        <Portal>
            {
                isVisible &&
                <Pressable style={styles.container} onPress={() => setVisible(false)}>

                    {/* This is the animated backdrop color: */}
                    <Animated.View style={{
                        backgroundColor: "#000",
                        position: "absolute", height: "100%", width: "100%",
                        opacity: animModal.interpolate({ inputRange: [0, 1], outputRange: [0, 0.33] })
                    }} />

                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
                    {/* The actual modal: */}
                    <Animated.View
                            onLayout={() => {modalRef.current.measure((_x, _y, _w, height) => {setHeight(height)})}} 
                            style={[styles.contentContainer, {
                                transform: [{translateY: animModal.interpolate({inputRange: [0, 1], outputRange: [height + 50, 0]})}],
                            }]} 
                    >
                        <Pressable ref={modalRef}>
                            {children}
                        </Pressable>
                    </Animated.View>
                    </KeyboardAvoidingView>
                </Pressable>
            }
        </Portal>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const insets = useSafeAreaInsets();
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end"
        },
        contentContainer: {
            backgroundColor: colors.elevation.level5,
            paddingBottom: insets.bottom,
            
        }
    });
}
