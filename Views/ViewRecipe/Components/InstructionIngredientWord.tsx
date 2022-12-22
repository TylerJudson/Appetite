import React, { Fragment, useRef, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Animated, Platform } from "react-native";
import { Divider, Surface, Text, useTheme } from "react-native-paper";


/**
 * Displays a highlighted ingredient that the user can click on to see the entire ingredient.
 * @param ingredients the ingredients to display above the highlighted word
 * @param children the word to highlight
 */
export function InstructionIngredientWord({ ingredients, children }: { ingredients: string[], children: string }) {
    return (
        <IngredientPopUp anchor={children}>
            {
                ingredients.map((ingredient, index) => (
                    <Fragment key={index}>
                        <Text style={{padding: 5}} numberOfLines={1}>
                            {ingredient}
                        </Text>
                        {index < ingredients.length - 1 && <Divider />}
                    </Fragment>
                ))
            }
        </IngredientPopUp>
    );
}




/**
 * Displays an anchor and a popup that appears above it when the user clicks on the anchor
 * @param anchor the word to display as the anchor
 * @param children the content of the popup 
 */
function IngredientPopUp({ anchor, children} : { anchor: string, children: React.ReactNode}) {

    const theme = useTheme();
    const colors = theme.colors;
    const screenWidth = useWindowDimensions().width;
    
    const [portalVisible, setPortalVisible] = useState(false);
    const [shift, setShift] = useState(0);

    const animPortal = useRef(new Animated.Value(0)).current;
    let portalRef: View | null;

    const styles = createPopUpStyles();

    //#region BEHAVIOR
    function openPortal() {
        if (!portalVisible) {
            setPortalVisible(true);
            Animated.timing(
                animPortal,
                {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                }
            ).start();
    
            setTimeout(closePortal, 3000);
        }
    }
    function closePortal() {
        Animated.timing(
            animPortal,
            {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }
        ).start(() => setPortalVisible(false));
    }
    //#endregion

    return (
        <Text>
            <Text style={{ color: colors.primary }} variant="bodyLarge" onPress={openPortal} onLayout={() => {console.log("hi")}}>{anchor}</Text>
            {
            portalVisible &&
            <Animated.View
                style={{
                    transform: [
                        { translateY: animPortal.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
                        { translateX: -anchor.length * 4 }
                    ],
                    opacity: animPortal,
                    position: "absolute",
                    backgroundColor: "#fee"
                }}
            >
                <Surface style={[styles.portalContainer, {transform: [{translateX: shift}]}]} elevation={5}>
                    <View
                        ref={(ref) => { portalRef = ref; }}
                        onLayout={() => {
                            if (!shift) {
                                portalRef?.measure((x, y, width, height, pageX) => {
                                    // If the popup exceeds the left side of the screen
                                    if (pageX < 5) {
                                        setShift(-pageX + 10);
                                    }
                                    // If the pop exceeds the right side of the screen
                                    else if (pageX + width > screenWidth - 10) {
                                        setShift(screenWidth - pageX - width - 10)
                                    }
                                })
                            }
                        }}
                    >
                        {children}
                    </View>
                </Surface>
                    
            </Animated.View>
            }
        </Text>
    )
}





function createPopUpStyles() {
    const screenWidth = useWindowDimensions().width;
    return StyleSheet.create({
        portalContainer: {
            position: 'absolute', bottom: Platform.OS == "web" ? 0 : 20,
            alignSelf: "center",
            padding: 5,
            borderRadius: 10,
            maxWidth: screenWidth * 3 / 4
        }
    });
}