import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useUserState } from "../../state";
import { createGlobalStyles } from "../styles/globalStyles";
import { loginEmailPassword, logout } from "../../FireBase/Authentication";
import { auth } from "../../firebaseConfig";

/**
 * This contains options that the user can tweek to get the right specifications.
 */
export default function Settings() {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const user = useUserState();


    function handleUserLogin() {
        loginEmailPassword()
        .then((user) => {
        })
    }



    return (
        <View style={globalStyles.screenContainer}>
            <Text variant="headlineLarge" >Settings</Text>
            {
            user
            ?   <View>
                    <Text>Currently signed in as: {user.displayName}</Text>
                    <Text>Email: {user.email}</Text>
                    <Button onPress={logout}>Logout</Button>
                </View>
            :
                <View>
                    <Text>You are not currently signed in.</Text>
                    <Button onPress={handleUserLogin}>Login as guest</Button>
                </View>

            }
        </View>
    );
}


