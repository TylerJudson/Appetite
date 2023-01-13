import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useUserState } from "../../state";
import { createGlobalStyles } from "../styles/globalStyles";
import { loginEmailPassword, logout } from "../../FireBase/Authentication";
import { auth } from "../../firebaseConfig";
import { Route } from "../navigation";
import { SettingWidget } from "./Components/SettingWidget";
import { ScrollView } from "react-native-gesture-handler";

/**
 * This contains options that the user can tweek to get the right specifications.
 */
export default function Settings({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const user = useUserState();

    function handleUserLogin() {
        loginEmailPassword()

    }



    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView>
                <Text variant="headlineLarge" >Settings</Text>
                
                <Text>ACCOUNT</Text>
                    {
                        user 
                        ? <>
                            <SettingWidget  
                                title="Account Information" 
                                icon={<></>} 
                                roundUpperCorners 
                                onPress={() => { }} 
                            />
                            <SettingWidget 
                                title="Log Out" 
                                icon={<></>}
                                roundBottomCorners
                                onPress={() => { }} 
                            />
                        </>
                        : <SettingWidget
                            title="Log In"
                            icon={<></>}
                            roundUpperCorners
                            roundBottomCorners
                            onPress={() => { }}
                        />
                }

                {
                    user && 
                    <>
                    <Text>PROFILE</Text>
                        <SettingWidget  
                            title="Public Profile" 
                            icon={<></>} 
                            roundUpperCorners 
                            onPress={() => { }} 
                        />
                        <SettingWidget  
                            title="Friends" 
                            icon={<></>} 
                            roundBottomCorners
                            onPress={() => { }} 
                        />
                    </>
                }


                <Text>GENERAL</Text>
                    <SettingWidget
                        title="Show Favorites at Top"
                        roundUpperCorners
                        icon={<IconButton icon="heart" />}
                        onPress={() => { }}
                    />
                    <SettingWidget  
                        title="About Appetite" 
                        icon={<></>} 
                        roundBottomCorners
                        onPress={() => { }} 
                    />

                <Text>SUPPORT</Text>
                    <SettingWidget
                        title="Get Help"
                        roundUpperCorners
                        icon={<></>}
                        onPress={() => { }}
                    />
                    <SettingWidget
                        title="See terms of service"
                        icon={<></>}
                        onPress={() => { }}
                    />
                    <SettingWidget
                        title="See privacy policy"
                        roundBottomCorners
                        icon={<></>}
                        onPress={() => { }}
                    />

            </ScrollView>
        </View>
    );
}


