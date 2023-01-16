import { View } from "react-native";
import { Appbar, Tooltip, Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function Header({ title, onBack, editing, setEditing }: { title?: string, onBack: VoidFunction, editing?: boolean, setEditing?: (editing: boolean) => void }) {
    const insets = useSafeAreaInsets();

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <Appbar.BackAction onPress={onBack} />
            <Appbar.Content title={title} />
            {
                setEditing &&
                <Button onPress={() => setEditing(!editing)}>{editing ? "Save" : "Edit"}</Button>
            }
        </Appbar.Header>
    )
}