import { Pressable, View, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Text } from "react-native-paper";
import * as ImageManipulator from 'expo-image-manipulator';




// TODO: Docs
/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function ImageChoser({ selectedImage, setSelectedImage }: { selectedImage: string, setSelectedImage: React.Dispatch<React.SetStateAction<string>> }) {

    const styles = createStyles();

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0,
            base64: true,
        });

        if (!result.canceled) {

            const manipResult = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 750, height: 750 } }],
                { base64: true, compress: 0 }
            )
            setSelectedImage('data:image/jpeg;base64,' + manipResult.base64)
        }
    };


    return (
        <View style={{ marginBottom: 10 }}>
            <Pressable onPress={pickImageAsync} >
                <Image style={styles.image} source={{ uri: selectedImage ? selectedImage : undefined}} />
            </Pressable>
            <Text style={{alignSelf: "center"}} variant="labelSmall">Click on the image above to select an image from your device.</Text>
        </View>
    )
}




/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        image: {
            height: 200, width: "100%",
        }
    });
}
