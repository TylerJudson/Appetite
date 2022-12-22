import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useFeaturedRecipeState } from "../../state";
import { createGlobalStyles } from "../styles/globalStyles";


/**
 * This contains options that the user can tweek to get the right specifications.
 */
export default function Settings() {
    const theme = useTheme();
    const colors = theme.colors;
    const { featuredRecipe, setFeaturedRecipe } = useFeaturedRecipeState();
    const globalStyles = createGlobalStyles();

    return (
        <View style={globalStyles.screenContainer}>
            <Text variant="headlineLarge" >Settings</Text>
        </View>
    );
}


