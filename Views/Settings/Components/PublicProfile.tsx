import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { Button, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import { User } from "../../../Models/User";
import { useUserState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { RootStackParamList } from "../../navigation";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Header } from "./Header";




export type SnackBarData = {
    visible: boolean;
    message?: string;
    action?: {
        label: string;
        onPressCode: "undoFriendRequest";
    }
}
type NavProps = NativeStackScreenProps<RootStackParamList, 'PublicProfile'>;

export function PublicProfile({ navigation, route }: NavProps) {
    
    const user = useUserState();

    const globalStyles = createGlobalStyles();
    const styles = createStyles();
    const colors = useTheme().colors;

    const [isFriend, setIsFriend] = useState(false);
    const [isPendingFriend, setIsPendingFriend] = useState(false);
    const [snackBar, setSnackBar] = useState<SnackBarData>({
        visible: false,
        message: "",
        action: undefined
    });

    const [editing, setEditing] = useState(false);
    const [skillLevelModalVisible, setSkillLevelModalVisible] = useState(false);

    const [profilePic, setProfilePic] = useState(user?.profilePicture || "");
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [skillLevel, setSkillLevel] = useState(user?.skillLevel || "");

    const [displayNameError, setDisplayNameError] = useState("");

    useEffect(() => {
        if (route.params && route.params.id) {
            const db = getDatabase();
            get(ref(db, "users-publicInfo/" + route.params.id)).then(snapshot => {
                if (snapshot.exists() && snapshot.val() && route.params) {
                    setProfilePic(snapshot.val().profilePicture);
                    setDisplayName(snapshot.val().displayName);
                    setSkillLevel(snapshot.val().skillLevel);
                }
            })
            if (user) {
                // Check to see if we are a pending friend
                get(ref(db, '/users-social/users/' + user.uid + "/pendingFriends/" + route.params.id)).then(snapshot => {
                    if (snapshot.exists() && snapshot.val()) {
                        setIsPendingFriend(true);
                    }   
                })
                // Check to see if we are a friend
                get(ref(db, "users-social/users/" + user.uid + "/friends/" + route.params.id )).then(snapshot => {
                    if (snapshot.exists() && snapshot.val()) {
                        setIsFriend(true);
                    }
                });
            }
        }
    })


    function removeFriend(id: string, name: string) {
        if (user) {
            const db = getDatabase();
            remove(ref(db, "users-social/users/" + user.uid + "/friends/" + id));
            remove(ref(db, "users-social/users/" + id + "/friends/" + user.uid));
            // TODO: remove posts from friend feed and notifications
            setIsFriend(false);
            setIsPendingFriend(false);
        }
    }

    function addFriend(id: string) {
        if (user) {
            const db = getDatabase();
            let updates: any = {};
            updates['/users-social/users/' + id + "/pendingFriends/" + user.uid] = Date.now();
            updates['/users-social/users/' + user?.uid + "/pendingFriends/" + id] = Date.now();
            updates['/users-social/users/' + id + "/inbox/friendRequests/" + user.uid] = { accepted: false, read: false, date: Date.now() };
            update(ref(db), updates);
            setIsPendingFriend(true);
            setSnackBar({ visible: true, message: "Friend request sent!", action: { label: "undo", onPressCode: "undoFriendRequest" } })
        }
    }
    async function handleButtonPress() {
        if (route.params) {
            if (isFriend) {
                if (Platform.OS === "web") {
                    if (window.confirm("Remove Friend?\nAre you sure you want to unfriend " + displayName + "?")) {
                        removeFriend(route.params.id, displayName);
                    }
                }
                else {
                    return Alert.alert(
                        "Remove Friend?",
                        "Are you sure you want to unfriend " + displayName + "?",
                        [
                            {
                                text: "No",
                                style: "cancel"
                            },
                            {
                                text: "Yes",
                                style: "destructive",
                                onPress: () => removeFriend(route.params?.id || "", displayName)
                            }
                        ]
                    )
                }
                
            }
            else {
                addFriend(route.params.id)
            }
        }
    }

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
            <Header title={route.params ? displayName :  "Public Profile"} onBack={navigation.goBack} editing={editing} setEditing={route.params ? undefined : handleEdit} />
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
                    

                    {route.params && <Button mode="outlined" disabled={isPendingFriend && !isFriend} style={{alignSelf: "flex-end", marginVertical: 30 }} textColor={isFriend ? colors.error : undefined} icon={isFriend ? "close" : "plus"} onPress={handleButtonPress} >{isFriend ? "Un-Friend" : "Send Friend Request"}</Button>}
                </View>
            </ScrollView>


            <Snackbar
                visible={snackBar.visible}
                onDismiss={() => { setSnackBar({ ...snackBar, visible: false }) }}
                duration={3000}
                action={snackBar.action ? {
                    label: snackBar.action?.label,
                    onPress: () => {
                        if (snackBar.action?.onPressCode === "undoFriendRequest" && route.params?.id && user?.uid) {
                            const db = getDatabase();
                            remove(ref(db, "users-social/users/" + route.params.id + "/pendingFriends/" + user?.uid));
                            remove(ref(db, "users-social/users/" + user?.uid + "/pendingFriends/" + route.params.id));
                            remove(ref(db, "users-social/users/" + route.params.id + "/inbox/friendRequests/" + user?.uid));
                            setIsPendingFriend(false);
                        }
                    }
                } : undefined}
            >
                {snackBar.message}
            </Snackbar>


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

