import { View, ViewProps, StyleSheet, ImageSourcePropType } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LinearGradientProps } from "expo-linear-gradient";
import { TagCard } from "./TagCard";



export type tagCard = {
    title: string
    image?: ImageSourcePropType
    gradient?: LinearGradientProps
}


interface props extends ViewProps {
    tagCards: tagCard[]
    openSearchModalWithTag: (tag: string) => void
}

export function TagGrid({ tagCards, openSearchModalWithTag, ...props }: props) {

    const styles = createStyles();

    return (
        <View {...props} >
            <View style={styles.container} >
                {tagCards.map((tag, index) => 
                    <View style={styles.tag} key={index}>
                        <TagCard title={tag.title} image={tag.image} onPress={() => openSearchModalWithTag(tag.title)} />
                    </View> 
                )}
            </View>
        </View>
    )
}




/**
 * Creates a set of styles that should be used for all components (for consistency).
 * @returns the styles
 */
export function createStyles() {
    const theme = useTheme();
    const colors = theme.colors;

    return StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1, flexDirection: "row", flexWrap: 'wrap', 
        },
        tag: {  
            margin: 8, flexGrow: 1, width: 100
        }
    })
}