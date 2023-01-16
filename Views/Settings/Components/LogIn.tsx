import { MutableRefObject, useState, useRef, useEffect } from "react";
import { ScrollView, View, StyleSheet, TextInput as input, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { TextInput, Text, Button, HelperText } from "react-native-paper";
import { forgotPassword, loginEmailPassword } from "../../../FireBase/Authentication";
import { Modal } from "../../components/Modal";






/**
 * Crates a screen that allows the user to sign in
 * @param loginModalVisible whether or not the login modal is visible or not
 * @param setLoginModalVisible sets the visibility of the login modal
 */
export function LogIn({ loginModalVisible, setLoginModalVisible }: { loginModalVisible: boolean, setLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef<input>() as MutableRefObject<input>;
    
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    // Set all the properties back to default when the visibility changes
    useEffect(() => {
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
    }, [loginModalVisible])

    /**
     * Handles the action of logging in
     */
    function handleUserLogin() {
        let error = false;

        // Check to make sure all the fields are not empty
        if (email === "") {
            setEmailError("Enter an email");
            error = true;
        }
        else {
            setEmailError("");
        }
        if (password === "") {
            setPasswordError("Enter a password");
            error = true;
        }
        else {
            setPasswordError("");
        }

        // Log the user in and show any errors
        if (!error) {
            loginEmailPassword(email, password)
            .then(result => {
                if (result === "Success") {
                    setLoginModalVisible(false);
                }
                else if (result === "Invalid Email") {
                    setEmailError("Couldn't find your Account");
                }
                else if (result === "Wrong Password") {
                    setPasswordError("Wrong Password. Try again or click Forgot password.");
                }
                else {
                    setEmailError(result);
                }
            })
        }

    }

    /**
     *  Handles the action of pressing the forgot password button
     */
    function handleForgotPassword() {
        forgotPassword(email)
        .then(result => {
            if (result === "Success") {
                setLoginModalVisible(false);

                // Show a success alert
                if (Platform.OS === "web") {
                    if (window.confirm(`Email Sent \n A password reset email has been sent to ${email}.`)) {
                    }
                }
                else {
                    return Alert.alert(
                        "Email Sent",
                        `A password reset email has been sent to ${email}.`,
                        [
                            {
                                text: "Okay",
                                style: "cancel"
                            },
                        ]
                    )
                }
            }
            // Show any errors
            else if (result === "Invalid Email") {
                setEmailError("Enter a valid email to reset your password.");
            }
            else {
                setEmailError(result);
            }
        })
    }
    
    const styles = createStyles();

    return (

        <Modal visible={loginModalVisible} setVisible={setLoginModalVisible} headerTitle="Appetite" headerButton="Cancel">
            <ScrollView style={{ height: "100%"}}>
                <View style={styles.container}>
                    <Text style={styles.title} variant="headlineMedium">Log In</Text>
                    <TextInput
                        style={styles.textInput}
                        autoFocus
                        value={email}
                        onChangeText={setEmail}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        error={emailError !== ""}
                        returnKeyType="next"
                        keyboardType="email-address"
                        label="Email"
                        mode="outlined"
                        blurOnSubmit={false}
                    />
                    <HelperText type="error" visible={emailError !== ""} padding="none" style={styles.helperText}>{emailError}</HelperText>
                    <TextInput
                        ref={passwordRef}
                        style={styles.textInput}
                        onChangeText={setPassword}
                        onSubmitEditing={handleUserLogin}
                        enablesReturnKeyAutomatically
                        error={passwordError !== ""}
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                    />
                    <HelperText type="error" visible={passwordError !== ""} padding="none" style={styles.helperText}>{passwordError}</HelperText>
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleForgotPassword}>Forgot Password?</Button>
                        <Button onPress={handleUserLogin}>Log In</Button>
                    </View>
                </View>

            </ScrollView>
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


