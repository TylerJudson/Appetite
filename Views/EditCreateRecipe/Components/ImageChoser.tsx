import { Pressable, View, Image, StyleSheet, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Text } from "react-native-paper";
import * as ImageManipulator from 'expo-image-manipulator';




/**
 * Displays an image and allows the user to change it
 * @param selectedImage The selected image the user has chosen
 * @param setSelectedImage The function to select the new image
 */
export function ImageChoser({ selectedImage, setSelectedImage }: { selectedImage: string, setSelectedImage: React.Dispatch<React.SetStateAction<string>> }) {

    const styles = createStyles();

    /** Picks the image */
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0,
            base64: true,
        });

        if (!result.canceled) {
            // Compress the image further
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
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        image: {
            height: screenWidth > 700 ? undefined : 200, 
            width: screenWidth > 700 ? undefined : "100%",
            aspectRatio: screenWidth > 700 ? 1 : undefined,
            margin: screenWidth > 700 ? 10 : undefined
        }
    });
}
