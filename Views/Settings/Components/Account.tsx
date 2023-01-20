import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MutableRefObject, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet, TextInput as input, Platform, Alert } from "react-native";
import { Text, useTheme, TextInput, HelperText, Button, IconButton } from "react-native-paper";
import { changePassword, loginEmailPassword } from "../../../FireBase/Authentication";
import { useUserState } from "../../../state";
import { Modal } from "../../components/Modal";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { RootStackParamList } from "../../navigation";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Header } from "./Header";
import { SettingWidget } from "./SettingWidget";




type AccountInfoNavProps = NativeStackScreenProps<RootStackParamList, 'Account'>;

export function Account({ navigation }: AccountInfoNavProps) {
    
    const user = useUserState();

    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const [visible, setModalVisible] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [verifyPasswordError, setVerifyPasswordError] = useState("");

    const newPasswordRef = useRef<input>() as MutableRefObject<input>;
    const verifyPasswordRef = useRef<input>() as MutableRefObject<input>;


    function handleChangePassword() {
        if (newPassword === "") {
            setNewPasswordError("Enter a password");
        }
        else {
            if (newPassword !== verifyPassword) {
                setNewPasswordError("Passwords must match");
                setVerifyPasswordError("Passwords must match");
            }
            else {
                setNewPasswordError("");
                setVerifyPasswordError("");
                loginEmailPassword(user?.email || "", currentPassword)
                    .then(result => {
                        if (result === "Success") {
                            setCurrentPasswordError("");
                            changePassword(newPassword)
                            .then(result => {
                                if (result === "Success") {
                                    setModalVisible(false);
                                    if (Platform.OS === "web") {
                                        if (window.confirm(`Password Changed \n Your password was successfully changed.`)) {
                                        }
                                    }
                                    else {
                                        return Alert.alert(
                                            "Password Changed",
                                            `Your password was successfully changed.`,
                                            [
                                                {
                                                    text: "Okay",
                                                    style: "cancel"
                                                },
                                            ]
                                        )
                                    }
                                }
                                else if (result === "Weak Password") {
                                    setNewPasswordError("Weak Password. Password should be at least 6 characters.")
                                }
                                else {
                                    setCurrentPasswordError(result);
                                }
                            })
                        }
                        else if (result === "Wrong Password") {
                            setCurrentPasswordError("Wrong Password.");
                        }
                    }
                )
            }
        }





    }

    return (
        <View style={globalStyles.container}>
            <Header title="Account" onBack={navigation.goBack} />

            <ScrollView>
                <View style={styles.container}>

                    <ImageChooser selectedImage={user?.profilePicture || ""}  profile editable={false} />
                    <Text style={{margin: 10}} variant="titleLarge">{user?.displayName}</Text>
                    
                    <View style={{maxWidth: 700, width: "100%", padding: 10}}>
                        <SettingWidget 
                            title={"Email"} 
                            icon={<IconButton icon="email" />}  
                            rightIcon={<Text style={{marginRight: 10}}>{user?.email}</Text>}   
                            roundUpperCorners               
                        />
                        <SettingWidget
                            title={"User Id:"}
                            icon={<IconButton icon="card-account-details"/>}
                            rightIcon={<Text style={{ marginRight: 10 }}>{user?.uid}</Text>}
                        />
                        <SettingWidget
                            title={"Change Password"}
                            icon={<IconButton icon="lock-reset" />}
                            onPress={() => setModalVisible(true)}
                            rightIcon={<IconButton icon={"chevron-right"} />}
                            roundBottomCorners
                        />
                    </View>


                </View>
            </ScrollView>

            <Modal visible={visible} setVisible={setModalVisible} headerTitle="Appetite" headerButton="Cancel">
                <ScrollView style={{ height: "100%" }}>
                    <View style={styles.container}>
                        <Text style={styles.title} variant="headlineMedium">Change Password</Text>

                        <TextInput
                            style={styles.textInput}
                            autoFocus
                            onChangeText={setCurrentPassword}
                            onSubmitEditing={() => newPasswordRef.current.focus()}
                            blurOnSubmit={false}
                            enablesReturnKeyAutomatically
                            error={currentPasswordError !== ""}
                            returnKeyType="next"
                            label="Current Password"
                            mode="outlined"
                            secureTextEntry
                        />
                        <HelperText type="error" visible={currentPasswordError !== ""} padding="none" style={styles.helperText}>{currentPasswordError}</HelperText>


                        <TextInput
                            style={styles.textInput}
                            ref={newPasswordRef}
                            onChangeText={setNewPassword}
                            onSubmitEditing={() => verifyPasswordRef.current.focus()}
                            blurOnSubmit={false}
                            enablesReturnKeyAutomatically
                            error={newPasswordError !== ""}
                            returnKeyType="next"
                            label="New Password"
                            mode="outlined"
                            secureTextEntry
                        />
                        <HelperText type="error" visible={newPasswordError !== ""} padding="none" style={styles.helperText}>{newPasswordError}</HelperText>

                        <TextInput
                            ref={verifyPasswordRef}
                            style={styles.textInput}
                            onChangeText={setVerifyPassword}
                            onSubmitEditing={handleChangePassword}
                            enablesReturnKeyAutomatically
                            error={verifyPasswordError !== ""}
                            label="Verify Password"
                            mode="outlined"
                            secureTextEntry
                        />
                        <HelperText type="error" visible={verifyPasswordError !== ""} padding="none" style={styles.helperText}>{verifyPasswordError}</HelperText>

                        <Button style={{ alignSelf: "flex-end" }} onPress={handleChangePassword}>Create</Button>
                    </View>

                </ScrollView>
            </Modal>

        </View>
    )
}





/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            alignItems: "center",
            flex: 1,
        },
        title: {
            marginTop: 40, marginBottom: 10,
            fontWeight: "300"
        },
        helperText: {
            alignSelf: "flex-start",
        },
        textInput: {
            flex: 1,
            width: "100%",
            marginHorizontal: 15, marginTop: 10
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "105%"
        }
    });
}

