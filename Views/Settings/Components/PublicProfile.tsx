import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useUserState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { createGlobalStyles } from "../../styles/globalStyles";
import { SettingsStackParamList } from "../Settings";
import { Header } from "./Header";




type NavProps = NativeStackScreenProps<SettingsStackParamList, 'PublicProfile'>;

export function PublicProfile({ navigation }: NavProps) {

    const user = useUserState();
    const globalStyles = createGlobalStyles();
    const styles = createStyles();
    const colors = useTheme().colors;

    const [editing, setEditing] = useState(false);
    const [skillLevelModalVisible, setSkillLevelModalVisible] = useState(false);

    const [profilePic, setProfilePic] = useState(user?.profilePicture || "");
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [skillLevel, setSkillLevel] = useState(user?.skillLevel || "");

    const [displayNameError, setDisplayNameError] = useState("");


    function handleEdit(edit: boolean) {
        if (edit) {
            setEditing(true);
        }
        else {
            if (displayName === "") {
                setDisplayNameError("Enter a name")
            }
            else {
                setEditing(false);
                const db = getDatabase();

                if (user) {
                    set(ref(db, 'users-publicInfo/' + user.uid), {
                        displayName: displayName,
                        numOfFriends: user.numOfFriends,
                        numOfPosts: user.numOfPosts,
                        skillLevel: skillLevel,
                        profilePicture: profilePic
                    })
                }
            }
        }
    }


    return (
        <View style={globalStyles.container}>
            <Header title="Public Profile" onBack={navigation.goBack} editing={editing} setEditing={handleEdit} />
            <ScrollView>
                <View style={styles.container}>

                    <ImageChooser selectedImage={profilePic} setSelectedImage={setProfilePic} profile editable={editing} />

                    <Text>{user?.numOfFriends} Friends • {user?.numOfPosts} Posts</Text>

                    <TextInput
                        style={styles.textInput}
                        value={displayName}
                        onChangeText={setDisplayName}
                        error={displayNameError !== ""}
                        label="Display Name"
                        mode="outlined"
                        editable={editing}
                    />

                    <View style={styles.textInput}>
                        <TouchableOpacity style={styles.skillLevelContainer} onPress={() => setSkillLevelModalVisible(true)} disabled={!editing}>
                            <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>Skill Level</Text>
                            <Text variant="titleMedium">{skillLevel}</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </ScrollView>


            <BottomModal visible={skillLevelModalVisible} setVisible={setSkillLevelModalVisible}>
                <View style={{ paddingBottom: 50, paddingTop: 20 }}>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => { setSkillLevelModalVisible(false); setSkillLevel("Beginner") }}><Text variant="titleMedium" style={{ textAlign: "center" }}>Beginner</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => { setSkillLevelModalVisible(false); setSkillLevel("Intermediate") }}><Text variant="titleMedium" style={{ textAlign: "center" }}>Intermediate</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.skillLevelButton} onPress={() => { setSkillLevelModalVisible(false); setSkillLevel("Advanced") }}><Text variant="titleMedium" style={{ textAlign: "center" }}>Advanced</Text></TouchableOpacity>
                </View>
            </BottomModal>
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
            padding: 15, 
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

