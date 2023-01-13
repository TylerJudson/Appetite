import { useWindowDimensions, View, StyleSheet } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useUserState } from "../../state";
import { createGlobalStyles } from "../styles/globalStyles";
import { loginEmailPassword, logout } from "../../FireBase/Authentication";
import { auth } from "../../firebaseConfig";
import { Route } from "../navigation";
import { SettingWidget } from "./Components/SettingWidget";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Account } from "./Components/Account";
import { PublicProfile } from "./Components/PublicProfile";
import { Friends } from "./Components/Friends";


export type SettingsStackParamList = {
    Settings: undefined;
    Account: undefined;

    PublicProfile: undefined;
    Friends: undefined;
};


const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigation() {
    return (
        <Stack.Navigator initialRouteName='Settings' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="PublicProfile" component={PublicProfile} />
            <Stack.Screen name="Friends" component={Friends} />
        </Stack.Navigator>
    )
}




type SettingsNavProps = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

/**
 * This contains options that the user can tweek to get the right specifications.
 */
function Settings({ navigation }: SettingsNavProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const user = useUserState();

    const styles = createStyles();


    function handleUserLogin() {
        loginEmailPassword("", "");
    }


    return (
        <View style={globalStyles.screenContainer}>
        <View style={styles.container}>
            <ScrollView>
                <Text variant="headlineLarge" >Settings</Text>
                
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>ACCOUNT</Text>
                        {
                            user 
                            ? <>
                                <SettingWidget  
                                    title={user.displayName} 
                                    subTitle={user.email}
                                    icon={<></>} 
                                    roundUpperCorners 
                                    onPress={() => navigation.navigate("Account")} 
                                />
                                <SettingWidget 
                                    title="Log Out" 
                                    icon={<></>}
                                    roundBottomCorners
                                    onPress={logout} 
                                />
                            </>
                            : <>
                                <SettingWidget
                                    title="Log In"
                                    icon={<></>}
                                    roundUpperCorners
                                    roundBottomCorners
                                    onPress={handleUserLogin}
                                />
                                <SettingWidget
                                    title="Create Account"
                                    icon={<></>}
                                    roundUpperCorners
                                    roundBottomCorners
                                    onPress={() => { }}
                                />
                            </>
                    }
                </View>


                {
                    user && 
                    <>
                    <View style={styles.sectionContainer}>
                        <Text>PROFILE</Text>
                            <SettingWidget  
                                title="Public Profile" 
                                icon={<></>} 
                                roundUpperCorners 
                                onPress={() => navigation.navigate("PublicProfile")} 
                            />
                            <SettingWidget  
                                title="Friends" 
                                icon={<></>} 
                                roundBottomCorners
                                onPress={() => navigation.navigate("Friends")} 
                            />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text>NOTIFICATIONS</Text>
                            <SettingWidget  
                                title="Some Notification Setting" 
                                icon={<></>} 
                                roundUpperCorners 
                                onPress={() => { }} 
                            />
                            <SettingWidget  
                                title="Some Notification Setting" 
                                icon={<></>} 
                                roundBottomCorners
                                onPress={() => { }} 
                            />
                    </View>
                    </>
                }

                <View style={styles.sectionContainer}>
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
                </View>

                <View style={styles.sectionContainer}>
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
                </View>

            </ScrollView>
        </View>
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        container: {

        },
        sectionContainer: {

        },
        sectionTitle: {

        }
    });
}


