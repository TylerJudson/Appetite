import { MutableRefObject, useState, useRef, useEffect } from "react";
import { ScrollView, View, StyleSheet, TextInput as input, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Text, Button, HelperText } from "react-native-paper";
import { loginEmailPassword } from "../../FireBase/Authentication";
import { Modal } from "../components/Modal";






// TODO: docs


export function LogIn({ loginModalVisible, setLoginModalVisible }: { loginModalVisible: boolean, setLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [changeToHide, setChangeToHide] = useState("");

    const passwordRef = useRef<input>() as MutableRefObject<input>;

    useEffect(() => {
        setUserName("");
        setPassword("");
        setUserNameError("");
        setPasswordError("");
    }, [loginModalVisible])

    const [userNameError, setUserNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    function handleUserLogin() {
        let error = false;

        if (userName === "") {
            setUserNameError("Enter an email");
            error = true;
        }
        else {
            setUserNameError("");
        }
        if (password === "") {
            setPasswordError("Enter a password");
            error = true;
        }
        else {
            setPasswordError("");
        }

        if (!error) {
            loginEmailPassword(userName, password)
            .then(result => {
                if (result === "Success") {
                    setChangeToHide(Math.random().toString());
                }
                else if (result === "Couldn't find your Account") {
                    setUserNameError("Couldn't find your Account");
                }
                else if (result === "Wrong Password. Try again or click Forgot password.") {
                    setPasswordError("Wrong Password. Try again or click Forgot password.");
                }
            })
        }

    }
    
    const styles = createStyles();

    return (

        <Modal visible={loginModalVisible} setVisible={setLoginModalVisible} headerTitle="Appetite" headerButton="Cancel" changeToHide={changeToHide}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView style={{ height: "100%"}}>
                <View style={styles.container}>
                    <Text style={styles.title} variant="headlineMedium">Log In</Text>
                    <TextInput
                        style={styles.textInput}
                        autoFocus
                        value={userName}
                        onChangeText={text => {setUserName(text)}}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        error={userNameError !== ""}
                        returnKeyType="next"
                        keyboardType="email-address"
                        label="Email"
                        mode="outlined"
                    />
                    <HelperText type="error" visible={userNameError !== ""} padding="none" style={styles.helperText}>{userNameError}</HelperText>
                    <TextInput
                        ref={passwordRef}
                        style={styles.textInput}
                        onChangeText={text => {setPassword(text)}}
                        onSubmitEditing={handleUserLogin}
                        enablesReturnKeyAutomatically
                        error={passwordError !== ""}
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                    />
                    <HelperText type="error" visible={passwordError !== ""} padding="none" style={styles.helperText}>{passwordError}</HelperText>
                    <View style={styles.buttonContainer}>
                        {/** // TODO: forgot password? */}
                        <Button>Forgot Password?</Button>
                        <Button onPress={handleUserLogin}>Log In</Button>
                    </View>
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}




/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {

    return StyleSheet.create({
        container: {
            alignItems: "center", height: "100%", padding: 15
        },
        title: {
            marginTop: 75, marginBottom: 10,
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


