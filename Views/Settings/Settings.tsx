import { useWindowDimensions, View, StyleSheet, Switch, Platform } from "react-native";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper";
import { useSettingsState, useUserState } from "../../state";
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
import { AboutAppetite } from "./Components/AboutAppetite";
import { GetHelp } from "./Components/GetHelp";
import { TermsOfService } from "./Components/TermsOfService";
import { PrivacyPolicy } from "./Components/PrivacyPolicy";
import { Route } from "../navigation";
import { ThemeColorPicker } from "./Components/ThemeColorPicker";


/**
 * This contains options that the user can tweek to get the right specifications.
 */
export function Settings({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();

    const {settings, setSettings} = useSettingsState();
    const user = useUserState();

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [getHelpVisible, setGetHelpVisible] = useState(false);
    const [termsOfServiceVisible, setTermsOfServiceVisible] = useState(false);
    const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);

    const [themeColorPickerVisible, setThemeColorPickerVisible] = useState(false);

    const styles = createStyles();

    const [newPosts, setNewPosts] = useState(true);
    const [friendRequests, setFriendRequests] = useState(true);
    const [postLikes, setPostLikes] = useState(true);
    const [postComments, setPostCommments] = useState(true);

    //#region BEHAVIOR
    function toggleFavorites() {
        settings.showFavoritesAtTop = !settings.showFavoritesAtTop;
        setSettings({...settings});
    }

    function toggleFriendRequests() {
        setFriendRequests(!friendRequests);
    }

    function toggleNewPosts() {
        setNewPosts(!newPosts)
    }

    function togglePostLikes() {
        setPostLikes(!postLikes);
    }

    function togglePostComments() {
        setPostCommments(!postComments);
    }
    //#endregion



    return (
        <View style={globalStyles.screenContainer}>
            <View style={styles.container}>
                <ScrollView style={{padding: 10}}>
                    <Text variant="headlineLarge" style={styles.header}>Settings</Text>
                    
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>ACCOUNT</Text>
                            {
                                user 
                                ? <>
                                    <SettingWidget  
                                        title={user.displayName} 
                                        subTitle={user.email}
                                        icon={<Avatar.Image size={30} source={user?.profilePicture ? {uri: user?.profilePicture} : require("../../assets/images/defaultProfilePic.jpeg")} style={{margin: 10}} />} 
                                        roundUpperCorners 
                                        rightIcon={<IconButton icon="chevron-right" />}
                                        onPress={() => route.navigation.navigate("Account")} 
                                    />
                                    <SettingWidget 
                                        title="Log Out" 
                                        icon={<IconButton icon="logout" iconColor={colors.error} />}
                                        roundBottomCorners
                                        rightIcon={<IconButton icon="chevron-right" iconColor={colors.error} />}
                                        onPress={logout} 
                                        danger
                                    />
                                </>
                                : <>
                                    <SettingWidget
                                        title="Log In"
                                        icon={<IconButton icon="login" />}
                                        roundUpperCorners
                                        rightIcon={<IconButton icon="chevron-right" />}
                                        onPress={() => setLoginModalVisible(true)}
                                    />
                                    <SettingWidget
                                        title="Create Account"
                                        icon={<IconButton icon="account-plus" />}
                                        roundBottomCorners
                                        rightIcon={<IconButton icon="chevron-right" />}
                                        onPress={() => setCreateModalVisible(true)}
                                    />
                                </>
                        }
                    </View>


                    {
                        user && 
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>PROFILE</Text>
                                <SettingWidget  
                                    title="Public Profile" 
                                    icon={<IconButton icon="account" />} 
                                    roundUpperCorners 
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => route.navigation.navigate("PublicProfile")} 
                                />
                                <SettingWidget  
                                    title="Friends" 
                                    icon={<IconButton icon="account-group" />} 
                                    roundBottomCorners
                                    rightIcon={<IconButton icon="chevron-right" />}
                                    onPress={() => route.navigation.navigate("Friends")} 
                                />
                        </View>

                    }


                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>GENERAL</Text>
                        <SettingWidget
                            title="Show Favorites at Top"
                            icon={<IconButton icon="heart" />}
                            roundUpperCorners
                            rightIcon={<Switch style={styles.switch} trackColor={{ true: colors.tertiary }} value={settings.showFavoritesAtTop} onValueChange={toggleFavorites} />}
                        />
                        <SettingWidget
                            title="Theme"
                            icon={<IconButton icon="brush" />}
                            rightIcon={<IconButton icon="circle" iconColor={colors.primary} />}
                            onPress={() => setThemeColorPickerVisible(true)}
                        />
                        <SettingWidget
                            title="About Appetite"
                            icon={<IconButton icon="information-outline" />}
                            roundBottomCorners
                            rightIcon={<IconButton icon="chevron-right" />}
                            onPress={() => setAboutModalVisible(true)}
                        />

                    </View>
                    

                    {
                        user &&
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
                                <SettingWidget
                                    title="New Posts"
                                    icon={<IconButton icon="message-plus-outline" />}
                                    roundUpperCorners
                                    rightIcon={<Switch style={styles.switch} trackColor={{ true: colors.tertiary }} value={newPosts} onValueChange={toggleNewPosts} />}
                                />
                                <SettingWidget  
                                    title="Friend Requests" 
                                    icon={<IconButton icon="account-multiple-plus" />} 
                                    rightIcon={<Switch style={styles.switch} trackColor={{true: colors.tertiary}} value={friendRequests} onValueChange={toggleFriendRequests} />}
                                />
                                <SettingWidget
                                    title="Post Comments"
                                    icon={<IconButton icon="chat-plus" />}
                                    rightIcon={<Switch style={styles.switch} trackColor={{ true: colors.tertiary }} value={postComments} onValueChange={togglePostComments} />}
                                />
                                <SettingWidget  
                                    title="Post Likes" 
                                    icon={<IconButton icon="heart-plus-outline" />} 
                                    roundBottomCorners
                                    rightIcon={<Switch style={styles.switch} trackColor={{ true: colors.tertiary }} value={postLikes} onValueChange={togglePostLikes} />}
                                />
                        </View>
                    }

                  

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>SUPPORT</Text>
                            <SettingWidget
                                title="Get Help"
                                roundUpperCorners
                                icon={<IconButton icon="human-greeting-variant" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => setGetHelpVisible(true)}
                            />
                            <SettingWidget
                                title="See terms of service"
                                icon={<IconButton icon="file-document-edit-outline" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => setTermsOfServiceVisible(true)}
                            />
                            <SettingWidget
                                title="See privacy policy"
                                roundBottomCorners
                                icon={<IconButton icon="shield-half-full" />}
                                rightIcon={<IconButton icon="chevron-right" />}
                                onPress={() => setPrivacyPolicyVisible(true)}
                            />
                    </View>

                </ScrollView>
            </View>

            <LogIn loginModalVisible={loginModalVisible} setLoginModalVisible={setLoginModalVisible} />
            <CreateAccount modalVisible={createModalVisible} setModalVisible={setCreateModalVisible} />

            <AboutAppetite modalVisible={aboutModalVisible} setModalVisible={setAboutModalVisible} />
            <GetHelp modalVisible={getHelpVisible} setModalVisible={setGetHelpVisible} />
            <TermsOfService modalVisible={termsOfServiceVisible} setModalVisible={setTermsOfServiceVisible} />
            <PrivacyPolicy modalVisible={privacyPolicyVisible} setModalVisible={setPrivacyPolicyVisible} />

            <ThemeColorPicker modalVisible={themeColorPickerVisible} setModalVisible={setThemeColorPickerVisible} />
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
            paddingBottom: 0, flex: 1
        },
        header: {
            margin: 10, marginBottom: 20
        },
        sectionContainer: {
            marginBottom: 20
        },
        sectionTitle: {
            color: "#aaa", marginLeft: 20, margin: 5
        },
        switch: {
            margin: 5,
            transform: [{scale: 0.75}]
        }
    });
}


