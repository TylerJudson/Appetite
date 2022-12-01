import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";


/**
 * Creates a set of styles that should be used for all components (for consistency).
 * @returns the styles
 */
export function createGlobalStyles() {
    const theme = useTheme();
    const colors = theme.colors;

    return StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1
        }
    })
}