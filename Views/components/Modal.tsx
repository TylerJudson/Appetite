import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Portal, Text, useTheme, Button } from "react-native-paper";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// TODO: docs and fix on light mode
/**
 * Displays a modal at the bottom of the screen
 */
export function Modal({ visible, setVisible, headerTitle, headerButton, children }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, headerTitle?: string, headerButton?: string, changeToHide?: string, children: React.ReactNode }) {
    const styles = createStyles();

    const [height, setHeight] = useState(1000);
    const [isVisible, setIsVisible] = useState(false);


    const animModal = useRef(new Animated.Value(0)).current;
    const modalRef = useRef<View>() as MutableRefObject<View>;
    
    /**
     * Hides the modal by displaying the hide animation.
     */
    function hideModal() {
        Animated.timing(
            animModal,
            {
                toValue: 0,
                duration: 250,
                easing: Easing.in(Easing.circle),
                useNativeDriver: true
            }
        ).start(() => setIsVisible(false));
    }

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.timing(
                animModal,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.out(Easing.exp),
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

                        {/* The actual modal: */}
                        <Animated.View
                            onLayout={() => { modalRef.current.measure((_x, _y, _w, height) => { setHeight(height) }) }}
                            style={[styles.modalContainer, {
                                transform: [{ translateY: animModal.interpolate({ inputRange: [0, 1], outputRange: [height  + height / 4, 0] }) }],
                            }]}
                        >
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <Pressable style={styles.contentContainer} ref={modalRef}>
                                {
                                    (headerTitle || headerButton) &&
                                    <View style={styles.header}>
                                        { headerTitle && <View style={styles.headerTitle}><Text style={{ fontWeight: "600", fontSize: 20 }} >{headerTitle}</Text></View>}
                                        { headerButton && <Button style={styles.headerButton} onPress={() => setVisible(false)}>{headerButton}</Button>}
                                    </View>
                                }
                                {children}
                            </Pressable>
                            </KeyboardAvoidingView>
                        </Animated.View>

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
    const screenWidth = useWindowDimensions().width;
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: screenWidth > 700 ? "center" : "flex-end",
            alignItems: screenWidth > 700 ? "center" : undefined
        },
        modalContainer: {
            justifyContent: "flex-end",
        },  
        header: {
            borderTopLeftRadius: 10, borderTopRightRadius: 10,
            width: "100%", height: 50,
            flexDirection: "row", justifyContent: "center",
            backgroundColor: colors.elevation.level1,
            
        },
        headerTitle: {
            justifyContent: "center",
        },
        headerButton: {
            justifyContent: "center",
            position: "absolute",
            alignSelf: 'center',
            right: 5
        },
        contentContainer: {
            height: screenWidth > 700 ? 600 : "97%",
            maxWidth: screenWidth > 700 ? 600 : undefined,
            
            backgroundColor: colors.background,
            borderRadius: 10
        }
    });
}
