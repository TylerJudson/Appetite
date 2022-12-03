import { Text, useTheme } from "react-native-paper";
import { useFeaturedRecipeState } from "../state";


/**
 * This contains options that the user can tweek to get the right specifications.
 */
export default function Settings() {
    const theme = useTheme();
    const colors = theme.colors;
    const { featuredRecipe, setFeaturedRecipe } = useFeaturedRecipeState();

    return (
        <Text variant="headlineLarge" >Settings</Text>
    );
}


