import { useWindowDimensions, View, StyleSheet } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useUserState } from "../../state";
import { createGlobalStyles } from "../styles/globalStyles";
import { logout } from "../../FireBase/Authentication";
import { SettingWidget } from "./Components/SettingWidget";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Account } from "./Components/Account";
import { PublicProfile } from "./Components/PublicProfile";
import { Friends } from "./Components/Friends";
import { useState } from "react";
import { LogIn } from "./Components/LogIn";
import { CreateAccount } from "./Components/CreateAccount";


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

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const styles = createStyles();





    return (
        <View style={globalStyles.screenContainer}>
            <View style={styles.container}>
                <ScrollView>
                    <Text variant="headlineLarge" >Settings</Text>
                    
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>ACCOUNT</Text>
                        <View style={styles.widgetContainer}>
                            {
                                user 
                                ? <>
                                    <SettingWidget  
                                        title={user.displayName} 
                                        subTitle={user.email}
                                        icon={<IconButton icon="" />} 
                                        roundUpperCorners 
                                        rightIcon={<IconButton icon="chevron-right" />}
                                        onPress={() => navigation.navigate("Account")} 
                                    />
                                    <View style={styles.seperator} />
                                    <SettingWidget 
                                        title="Log Out" 
                                        icon={<></>}
                                        roundBottomCorners
                                        rightIcon={<IconButton icon="logout" />}
                                        onPress={logout} 
                                    />
                                </>
                                : <>
                                    <SettingWidget
                                        title="Log In"
                                        icon={<></>}
                                        roundUpperCorners
                                        roundBottomCorners
                                        rightIcon={<IconButton icon="login" />}
                                        onPress={() => setLoginModalVisible(true)}
                                    />
                                    <View style={styles.seperator} />
                                    <SettingWidget
                                        title="Create Account"
                                        icon={<IconButton icon="" />}
                                        roundUpperCorners
                                        roundBottomCorners
                                        rightIcon={<IconButton icon="chevron-right" />}
                                        onPress={() => setCreateModalVisible(true)}
                                    />
                                </>
                        }
                        </View>
                    </View>


                    {
                        user && 
                        <>
                        <View style={styles.sectionContainer}>
                            <Text>PROFILE</Text>
                                <SettingWidget  
                                    title="Public Profile" 
                                    icon={<IconButton icon="" />} 
                                    roundUpperCorners 
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => navigation.navigate("PublicProfile")} 
                                />
                                <View style={styles.seperator} />
                                <SettingWidget  
                                    title="Friends" 
                                    icon={<IconButton icon="" />} 
                                    roundBottomCorners
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => navigation.navigate("Friends")} 
                                />
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text>NOTIFICATIONS</Text>
                                <SettingWidget  
                                    title="Some Notification Setting" 
                                    icon={<IconButton icon="" />} 
                                    roundUpperCorners 
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => { }} 
                                />
                                <View style={styles.seperator} />
                                <SettingWidget  
                                    title="Some Notification Setting" 
                                    icon={<IconButton icon="" />} 
                                    roundBottomCorners
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => { }} 
                                />
                        </View>
                        </>
                    }

                    <View style={styles.sectionContainer}>
                        <Text>GENERAL</Text>
                            <SettingWidget
                                title="Show Favorites at Top"
                                icon={<IconButton icon="heart" />}
                                roundUpperCorners
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => { }}
                            />
                            <View style={styles.seperator} />
                            <SettingWidget  
                                title="About Appetite" 
                                icon={<IconButton icon="" />} 
                                roundBottomCorners
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => { }} 
                            />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text>SUPPORT</Text>
                            <SettingWidget
                                title="Get Help"
                                roundUpperCorners
                                icon={<IconButton icon="" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => { }}
                            />
                            <View style={styles.seperator} />
                            <SettingWidget
                                title="See terms of service"
                                icon={<IconButton icon="" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => { }}
                            />
                            <View style={styles.seperator} />
                            <SettingWidget
                                title="See privacy policy"
                                roundBottomCorners
                                icon={<IconButton icon="" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => { }}
                            />
                    </View>

                </ScrollView>
            </View>

            <LogIn loginModalVisible={loginModalVisible} setLoginModalVisible={setLoginModalVisible} />
            <CreateAccount modalVisible={createModalVisible} setModalVisible={setCreateModalVisible} />

        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {

        },
        sectionContainer: {

        },
        sectionTitle: {

        },
        widgetContainer: {

        },
        seperator: {

        }
    });
}


