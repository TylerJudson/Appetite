import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, Portal, Modal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/**
 * Displays a modal at the bottom of the screen // TODO: DOCUMENTATION
 */
export function BottomModal({ visible, setVisible, children }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, children: React.ReactNode }) {
    const styles = createStyles();

    const [height, setHeight] = useState(1000);
    const [backDropVisible, setBackDropVisible] = useState(true);

    const animModal = useRef(new Animated.Value(0)).current;
    const modalRef = useRef<View>() as MutableRefObject<View>;

    function hideModal() {
        Animated.timing(
            animModal,
            {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }
            ).start(() => {setVisible(false); setBackDropVisible(true); });
        setBackDropVisible(false);
    }

    useEffect(() => {
        if (visible && backDropVisible) {
            setBackDropVisible(true);
            Animated.timing(
                animModal,
                {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true
                }
                ).start()
        }
    })

    return (
        <Portal>
            {
                visible &&
                <Pressable style={[styles.container, {backgroundColor: backDropVisible ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0)"}]} onPress={hideModal}>
                    <Animated.View
                            onLayout={() => {modalRef.current.measure((_x, _y, _w, height) => {setHeight(height)})}} 
                            style={[styles.contentContainer, {transform: [{translateY: animModal.interpolate({inputRange: [0, 1], outputRange: [height + 50, 0]})}]}]} 
                    >
                        <Pressable ref={modalRef}>
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

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end"
        },
        contentContainer: {
            backgroundColor: "#333", // TODO: Dark and light mode
            paddingBottom: insets.bottom,
            
        }
    });
}
