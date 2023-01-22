import { View } from "react-native";
import { Appbar, Tooltip, Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


/** 
 * Creates a header with a simple back button, optional title, and optional edit/save button in the top corner
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param onBack the function to call when the user clicks on the back button
 * @param editing Whether or not to display edit or save
 * @param setEditing The function to call when the user clicks on the edit/save button
 */
export function Header({ title, onBack, editing, setEditing }: { title?: string, onBack: VoidFunction, editing?: boolean, setEditing?: (editing: boolean) => void }) {
    const insets = useSafeAreaInsets();

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <Appbar.BackAction onPress={onBack} />
            <Appbar.Content title={title} mode="center-aligned" />
            {
                setEditing &&
                <Button onPress={() => setEditing(!editing)}>{editing ? "Save" : "Edit"}</Button>
            }
        </Appbar.Header>
    )
}