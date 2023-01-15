import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Appbar, Tooltip, Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation";


/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function Header({ title, button, leftButton }: { title?: string, button?: { label: string, onPress: VoidFunction }, leftButton: { label?: string, onPress: VoidFunction } }) {
    const insets = useSafeAreaInsets();

    return (
        <Appbar.Header statusBarHeight={insets.top > 20 ? insets.top - 35 : insets.top}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", top: insets.top ? insets.top - 35 : undefined}}>

                {
                    leftButton.label
                        ? <Button onPress={leftButton.onPress}>{leftButton.label}</Button>

                        : <Tooltip title="Back">
                            <Appbar.BackAction onPress={leftButton.onPress} style={{ top: 3 }} />
                        </Tooltip>
                }
                {
                    title &&
                    <Text variant="titleMedium" style={{ bottom: 8 }}>{title}</Text>
                }

                {
                    button &&
                    <Button onPress={button.onPress}>{button.label}</Button>

                }
            </View>
        </Appbar.Header>
    )
}