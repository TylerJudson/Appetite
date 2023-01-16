import { getDatabase, ref, set } from "firebase/database";
import { MutableRefObject, useState, useRef, useEffect } from "react";
import { ScrollView, View, StyleSheet, TextInput as input, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput, Text, Button, HelperText, useTheme, Menu } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createAccount, forgotPassword, loginEmailPassword } from "../../../FireBase/Authentication";
import { useRecipeBookState, useUserState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";
import { Modal } from "../../components/Modal";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";






/**
 * Creates a modal that allows the user to create an accoung
 * @param modalVisible whether or not the create account modal is visible or not
 * @param setModalVisible the function to change the visibility of the modal
 */ 
export function CreateAccount({ modalVisible, setModalVisible }: { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const {recipeBook} = useRecipeBookState();

    const [profilePicture, setProfilePicture] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const verifyPasswordRef = useRef<input>() as MutableRefObject<input>;
    const displayNameRef = useRef<input>() as MutableRefObject<input>;
    
    const [emailError, setEmailError] = useState("");
    const [displayNameError, setDisplayNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [verifyPasswordError, setVerifyPasswordError] = useState("");

    const [skillLevelModalVisible,setSkillLevelModalVisible] = useState(false);
    
    /**
     * When the visibility changes -> reset all of the properties
     */
    useEffect(() => {
        setProfilePicture("");
        setEmail("");
        setDisplayName("");
        setSkillLevel("Beginner");
        setPassword("");

        setEmailError("");
        setDisplayNameError("");
        setPasswordError("");
        setVerifyPasswordError("");
    }, [modalVisible])

    /**
     * Handles the action of creating an account
     */
    function handleCreate() {
        let error = false;

        //#region Validation

        // check each of the entries for empty strngs
        if (email === "") {
            setEmailError("Enter an email");
            error = true;
        }
        else {
            setEmailError("");
        }
        if (displayName === "") {
            setDisplayNameError("Enter a name")
            error = true;
        }
        else {
            setDisplayNameError("");
        }
        if (password === "") {
            setPasswordError("Enter a password");
            error = true;
        }
        else {
            if (verifyPassword === "") {
                setVerifyPasswordError("Enter a password");
                error = true;
            }
            else {
                // Check to make sure the passwords match
                if (password !== verifyPassword) {
                    setVerifyPasswordError("Passwords must match");
                    setPasswordError("Passwords must match");
                    error = true;
                }
                else {
                    setPasswordError("");
                    setVerifyPasswordError("");
                }
            }
        }
        //#endregion


        if (!error) {
            createAccount(email, password)
            .then(result => {
                // If the result was successful then add the users recipe to the database, show a success alert, and close the modal.
                if (result.code === "Success") {
                    if (result.uid) {
                        const db = getDatabase();
                        
                        // Get all of the recipes and images to send to the database
                        const recipeImages: {[id: string]: string} = {};
                        const recipes: {[id: string]: {}} = {};
                        Object.values(recipeBook.recipes).map(recipe => {
                            recipeImages[recipe.id] = recipe.image
                            const newRecipe: any = recipe.onlyDefinedProperties();
                            newRecipe["created"] = Date.now();
                            recipes[recipe.id] = newRecipe;
                        });

                        setTimeout(() => {
                            // Send data to the database
                            set(ref(db, 'users/' + result.uid), {
                                recipeImages: recipeImages,
                                recipes: recipes,
                            });

                            // Send user info to the databse
                            set(ref(db, 'users-publicInfo/' + result.uid), {
                                displayName: displayName,
                                numOfFriends: 0,
                                numOfPosts: 0,
                                skillLevel: skillLevel,
                                profilePicture: profilePicture
                            });
                        }, 2000)
                    }

                    setModalVisible(false);

                    if (Platform.OS === "web") {
                        if (window.confirm(`Account Created \n Your account was successfully created.`)) {
                        }
                    }
                    else {
                        return Alert.alert(
                            "Account Created",
                            `Your account was successfully created.`,
                            [
                                {
                                    text: "Okay",
                                    style: "cancel"
                                },
                            ]
                        )
                    }
                }
                // Show errors when the result sends back errors
                else if (result === "Invalid Email") {
                    setEmailError("Invalid Email. Please enter a valid email to create an account.")
                }
                else if (result === "Weak Password") {
                    setPasswordError("Week Password. Password should be at least 6 characters")
                }
                else if (result === "Account Exists") {
                    setEmailError("This account already exists. Please log in.")
                }
                else {
                    setEmailError(result);
                }

            })
        }

    }


    const styles = createStyles();

    return (

        <Modal visible={modalVisible} setVisible={setModalVisible} headerTitle="Appetite" headerButton="Cancel">
            <SafeAreaProvider>

            <ScrollView style={{ height: "100%"}}>
                <View style={styles.container}>
                    <Text style={styles.title} variant="headlineMedium">Create Account</Text>

                    <ImageChooser selectedImage={profilePicture} setSelectedImage={setProfilePicture} profile />

                    <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                        onSubmitEditing={() => displayNameRef.current.focus()}
                        blurOnSubmit={false}
                        error={emailError !== ""}
                        returnKeyType="next"
                        keyboardType="email-address"
                        label="Email"
                        mode="outlined"
                    />
                    <HelperText type="error" visible={emailError !== ""} padding="none" style={styles.helperText}>{emailError}</HelperText>

                    <TextInput
                        ref={displayNameRef}
                        style={styles.textInput}
                        value={displayName}
                        onChangeText={setDisplayName}
                        error={displayNameError !== ""}
                        label="Display Name"
                        mode="outlined"
                    />
                    {displayNameError !== "" && <HelperText type="error" visible={displayNameError !== ""} padding="none" style={styles.helperText}>{displayNameError}</HelperText> }
                    {displayNameError === "" && <HelperText type="info" visible={displayNameError === ""} padding="none" style={styles.helperText}>This is so other users can identify you.</HelperText>}

                    <View style={styles.textInput}>
                        <TouchableOpacity style={styles.skillLevelContainer} onPress={() => setSkillLevelModalVisible(true)}>
                            <Text variant="titleMedium" style={{color: useTheme().colors.onSurfaceVariant}}>Skill Level</Text>
                            <Text variant="titleMedium">{skillLevel}</Text>
                        </TouchableOpacity>
                        <HelperText type="info" padding="none">Help Appetite suggest recipes.</HelperText>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        onChangeText={setPassword}
                        onSubmitEditing={() => verifyPasswordRef.current.focus()}
                        blurOnSubmit={false}
                        enablesReturnKeyAutomatically
                        error={passwordError !== ""}
                        returnKeyType="next"
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                    />
                    <HelperText type="error" visible={passwordError !== ""} padding="none" style={styles.helperText}>{passwordError}</HelperText>

                    <TextInput
                        ref={verifyPasswordRef}
                        style={styles.textInput}
                        onChangeText={setVerifyPassword}
                        onSubmitEditing={handleCreate}
                        enablesReturnKeyAutomatically
                        error={verifyPasswordError !== ""}
                        label="Verify Password"
                        mode="outlined"
                        secureTextEntry
                    />
                    <HelperText type="error" visible={verifyPasswordError !== ""} padding="none" style={styles.helperText}>{verifyPasswordError}</HelperText>
                   
                    <Button style={{alignSelf: "flex-end"}} onPress={handleCreate}>Create</Button>
                </View>

            </ScrollView>

            <BottomModal visible={skillLevelModalVisible} setVisible={setSkillLevelModalVisible}>
                <View style={{ paddingBottom: 50, paddingTop: 20 }}>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => {setSkillLevelModalVisible(false); setSkillLevel("Beginner")}}><Text variant="titleMedium" style={{textAlign: "center"}}>Beginner</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => {setSkillLevelModalVisible(false); setSkillLevel("Intermediate")}}><Text variant="titleMedium" style={{textAlign: "center"}}>Intermediate</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => {setSkillLevelModalVisible(false); setSkillLevel("Advanced")}}><Text variant="titleMedium" style={{textAlign: "center"}}>Advanced</Text></TouchableOpacity>
                </View>
            </BottomModal>
            </SafeAreaProvider>

        </Modal>
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
            alignItems: "center", height: "100%", padding: 15, flex: 1, paddingBottom: 300
        },
        title: {
            marginTop: 20, marginBottom: 20,
            fontWeight: "300"
        },
        helperText: {
            alignSelf: "flex-start",
        },
        textInput: {
            width: "100%", 
            marginHorizontal: 15, marginTop: 10
        },
        skillLevelContainer: {
            flexDirection: "row", justifyContent: "space-between",
            borderWidth: 1, borderColor: colors.outline, borderRadius: 5,
            padding: 12
        },
        skillLevelButton: {
            width: "100%",
            padding: 10,
        }
    });
}


