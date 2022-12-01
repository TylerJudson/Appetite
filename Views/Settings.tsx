import { Text, useTheme } from "react-native-paper";


/**
 * This contains options that the user can tweek to get the right specifications.
 */
export default function Settings() {
    const theme = useTheme();
    const colors = theme.colors;
    
    return (
        <Text variant="headlineLarge" >Settings</Text>
    );
}


