import { Alert, AlertButton, Platform } from "react-native";


export function alert(title: string, description: string, buttons: AlertButton[], webOnPress?: Function) {
    if (Platform.OS === "web") {
        if (window.confirm(`${title}\n${description}`)) {
            if (webOnPress) {
                webOnPress();
            }
        }
    }
    else {
        return Alert.alert(title, description, buttons)
    }
}