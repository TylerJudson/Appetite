import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/**
 * Creates a set of styles that should be used for all components (for consistency).
 * @returns the styles
 */
export function createGlobalStyles() {
    const theme = useTheme();
    const colors = theme.colors;


    const insets = useSafeAreaInsets();

    return StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1
        },
        screenContainer: {
            backgroundColor: colors.background,
            flex: 1,
            paddingTop: insets.top - 10

        }
    })
}