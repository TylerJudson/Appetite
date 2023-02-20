import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { get, getDatabase, limitToFirst, orderByChild, push, query, ref, remove, set, startAfter, update } from "firebase/database";
import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, useWindowDimensions } from "react-native";
import { Button, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { Post } from "../../../Models/Post";
import { Recipe } from "../../../Models/Recipe";
import { User } from "../../../Models/User";
import { useUserState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { RootStackParamList } from "../../navigation";
import { PostCard } from "../../Social/Components/PostCard";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Header } from "./Header";
import { Comment } from "../../../Models/Post";



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
    const screenWidth = useWindowDimensions().width;
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
    const [posts, setPosts] = useState<Post[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    //#region PUBLIC BEHEAVIOR
    function getUserInfo() {
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
                get(ref(db, "users-social/users/" + user.uid + "/friends/" + route.params.id)).then(snapshot => {
                    if (snapshot.exists() && snapshot.val()) {
                        setIsFriend(true);
                    }
                });
            }
        }
    }

    useEffect(getUserInfo, [user])


    async function removeFriend(id: string, name: string) {
        if (user) {
            const db = getDatabase();
            // Remove friend from friends
            remove(ref(db, "users-social/users/" + user.uid + "/friends/" + id));
            remove(ref(db, "users-social/users/" + id + "/friends/" + user.uid));

            // Remove all of the other user's posts from your friend feed
            get(ref(db, "users-social/users/" + id + "/posts")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    Object.keys(snapshot.val()).forEach(key => {
                        remove(ref(db, "users-social/users/" + user.uid + "/friendFeed/" + key));
                    });
                }
            });
            // Remove all of our posts from the other user's friend feed
            get(ref(db, "users-social/users/" + user.uid + "/posts")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    const updates: any = {};
                    Object.keys(snapshot.val()).forEach(key => {
                        remove(ref(db, "users-social/users/" + id + "/friendFeed/" + key));
                    });
                    update(ref(db), updates);
                }
            });

            // Send an unfriend notification
            set(push(ref(db, "users-social/users/" + id + "/inbox/notifications/")), { code: "unfriend", id: user.uid, date: Date.now(), read: false })
            setIsFriend(false);

            // Decrement number of friends
            set(ref(db, "users-publicInfo/" + user.uid + "/numOfFriends"), user.numOfFriends - 1);
            set(ref(db, "users-publicInfo/" + id + "/numOfFriends"), await get(ref(db, "users-publicInfo/" + id + "/numOfFriends")).then(data => { if (data.exists()) return parseInt(data.val()) - 1; else return 0; }))

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
    //#endregion

    //#region GET POST BEHAVIOR
    async function getComments(data: any, postRef: Post) {

        if (data) {
            const db = getDatabase();
            const array = Object.keys(data).sort((a, b) => data[a].date - data[b].date);
            const comments: Comment[] = [];

            for (let i = 0; i < array.length; i++) {
                const key = array[i];
                const value = data[key];
                const newComment: Comment = {
                    author: {
                        authorId: "",
                        authorName: "",
                        authorPic: undefined
                    },
                    commentId: key,
                    value: value.value,
                    date: value.date
                };

                await get(ref(db, "users-publicInfo/" + value.authorId)).then(snapshot => {
                    newComment.author = {
                        authorId: value.authorId,
                        authorName: snapshot.val().displayName,
                        authorPic: snapshot.val().profilePicture
                    }
                    comments.push(newComment);
                })

                if (i == array.length - 1) {
                    postRef.comments = comments;
                }
            }
        }

    }
    function getPosts() {
        const db = getDatabase();
        let r = ref(db, "users-social/users/" + (route.params?.id || user?.uid) + "/posts/");
        let q = query(r, orderByChild("created"), limitToFirst(2), startAfter(posts[posts.length - 1]?.timeStamp || null))
        get(q).then(async snapShot => {
            if (snapShot.exists() && snapShot.val()) {
                snapShot.forEach(child => {
                    const post = child.val();
                    get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                        if (data.exists() && data.val()) {
                            let linkedRecipe: Recipe | undefined = undefined;
                            if (post.linkedRecipe) {
                                linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                            }

                            const newPost = new Post(child.key || "", data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                            posts.push(newPost);
                            getComments(post.comments, newPost);
                            setPosts([...posts.sort((a, b) => a.timeStamp - b.timeStamp)]);
                        }
                    })
                })
            }
        })
    }

    useEffect(getPosts, []);
    //#endregion


    return (
        <View style={globalStyles.container}>
            <Header title={route.params ? displayName :  "Public Profile"} onBack={navigation.goBack} editing={editing} setEditing={route.params ? undefined : handleEdit} />
            <Animated.FlatList
                data={posts}
                onEndReached={getPosts}
                onEndReachedThreshold={0.25}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    getUserInfo();
                    posts.splice(0, posts.length);
                    getPosts();
                    setTimeout(() => setRefreshing(false), 500);
                }}
                keyExtractor={(item, index) => item === undefined ? index.toString() : item.id}
                renderItem={({ item }) => {
                    return <Animated.View entering={FadeIn} style={{ flex: 1 / Math.floor(screenWidth / 300) }}>
                        <PostCard post={item} navigation={navigation as any} />
                    </Animated.View>
                }}
                //@ts-ignore
                itemLayoutAnimation={screenWidth >= 600 ? undefined : Layout}
                contentContainerStyle={{paddingBottom: 100}}
                numColumns={Math.floor(screenWidth / 300)}
                key={Math.floor(screenWidth / 300)}
                ListHeaderComponent={<View style={styles.container}>

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


                    {route.params && route.params.id != user?.uid && <Button mode="outlined" disabled={isPendingFriend && !isFriend} style={{ alignSelf: "flex-end", marginTop: 30 }} textColor={isFriend ? colors.error : undefined} icon={isFriend ? "close" : "plus"} onPress={handleButtonPress} >{isFriend ? "Un-Friend" : "Send Friend Request"}</Button>}

                    {posts.length != 0 && <Text variant="titleLarge" style={{alignSelf: "flex-start", marginTop: 30, top: 10}}>Posts</Text>}
                </View>}
            />



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

