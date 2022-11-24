import { Text, useTheme } from "react-native-paper";

export default function Settings() {
    const theme = useTheme();
    const colors = theme.colors;
    
    return (
        <Text variant="headlineLarge" >Settings -- this is a </Text>
    );
}


