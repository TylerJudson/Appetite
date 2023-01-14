import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { Portal, Text, useTheme, Button } from "react-native-paper";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// TODO: docs
/**
 * Displays a modal at the bottom of the screen
 */
export function Modal({ visible, setVisible, headerTitle, headerButton, children, changeToHide }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, headerTitle?: string, headerButton?: string, changeToHide?: string, children: React.ReactNode }) {
    const styles = createStyles();

    const [height, setHeight] = useState(1000);


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
        ).start(() => setVisible(false));
    }

    useEffect(() => {
        if (visible) {
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
    })

    useEffect(() => {
        if (changeToHide !== "") {
            hideModal();
        }
    }, [changeToHide])

    return (
        <Portal>
            {
                visible &&
                <Pressable style={styles.container} onPress={hideModal}>

                    {/* This is the animated backdrop color: */}
                    <Animated.View style={{
                        backgroundColor: "#000",
                        position: "absolute", height: "100%", width: "100%",
                        opacity: animModal.interpolate({ inputRange: [0, 1], outputRange: [0, 0.33] })
                    }} />

                        {/* The actual modal: */}
                        <Animated.View
                            onLayout={() => { modalRef.current.measure((_x, _y, _w, height) => { setHeight(height) }) }}
                            style={{
                                justifyContent: "flex-end",
                                transform: [{ translateY: animModal.interpolate({ inputRange: [0, 1], outputRange: [height  + height / 4, 0] }) }],
                            }}
                        >
                            <Pressable style={styles.contentContainer} ref={modalRef}>
                                {
                                    (headerTitle || headerButton) &&
                                    <View style={styles.header}>
                                        { headerTitle && <View style={styles.headerTitle}><Text style={{ fontWeight: "600", fontSize: 20 }} >{headerTitle}</Text></View>}
                                        { headerButton && <Button style={styles.headerButton} onPress={hideModal}>{headerButton}</Button>}
                                    </View>
                                }
                                {children}
                            </Pressable>
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
    const insets = useSafeAreaInsets();
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end"
        },
        header: {
            borderTopLeftRadius: 10, borderTopRightRadius: 10,
            width: "100%", height: 50,
            flexDirection: "row", justifyContent: "center",
            backgroundColor: colors.elevation.level1
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
            height: "97%",
            backgroundColor: colors.background,
            borderTopLeftRadius: 10, borderTopRightRadius: 10,
        }
    });
}
