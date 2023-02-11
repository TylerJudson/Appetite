import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { get, getDatabase, onValue, push, ref, remove, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Appbar, Tooltip, Button, Text, Badge, SegmentedButtons, Avatar, useTheme, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserState } from "../../../state";
import { Modal } from "../../components/Modal";
import { SwipeToDelete } from "../../EditCreateRecipe/Components/Swipe";
import { RootStackParamList } from "../../navigation";



type navProps = NativeStackNavigationProp<RootStackParamList, 'Appetite'>;
type friend = {
    picture: string, name: string, id: string, accepted: boolean, date: number, read: boolean
}
type message = {
    message: string, 
    read: boolean, 
    date: number,
    notificationId: string,
    id: string,
    picture: string,
    postId?: string,
}



/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function Header({ title, navigation }: { title?: string, navigation: navProps }) {

    const user = useUserState();

    const insets = useSafeAreaInsets();
    const styles = createStyles();

    const [inboxModalVisible, setInboxModalVisible] = useState(false);

    const [notifications, setNotifications] = useState<message[]>([]);
    const [friendRequests, setFriendRequests] = useState<friend[]>([]);

    const [unread, setUnRead] = useState(0);
    const [unreadFriend, setunReadFriend] = useState(0);

    const [segmentedValue, setSegmentedValue] = useState("Notifications");

    //#region BEHAVIOR
    useEffect(() => {
        if (user) {
            const db = getDatabase();
            onValue(ref(db, "users-social/users/" + user.uid + "/inbox/notifications/"), (async snapShot => {
                if (snapShot.exists() && snapShot.val()) {
                    let unreadCount = 0;
                    const ntfcns: message[] = []
                    const keys = Object.keys(snapShot.val());
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        const value = snapShot.val()[key];
                        await get(ref(db, "users-publicInfo/" + value.id)).then(data => {
                            value.picture = data.val().profilePicture;
                            
                            if (!value.read) {
                                unreadCount++;
                            }

                            let message = "";
                            if (value.code === "accept") {
                                message = data.val().displayName + " has accepted your friend request.";
                            }
                            else if (value.code === "unfriend") {
                                message = data.val().displayName + " has un-friended you.";
                            }
                            else if (value.code === "post") {
                                message = data.val().displayName + ` has posted "${value.title}". `;
                            }
                            else if (value.code === "like") {
                                message = data.val().displayName + ` has liked your post "${value.title}".`;
                            }
                            else if (value.code === "unlike") {
                                message = data.val().displayName + ` has unliked your post "${value.title}".`;
                            }
                            else if (value.code === "comment") {
                                message = data.val().displayName + ` has commented on your post "${value.title}".`;
                            }
                            ntfcns.push({ message: message, read: value.read, date: value.date, id: value.id, postId: value.postId, picture: value.picture, notificationId: key });
                        })

                        if (i == keys.length - 1) {
                            ntfcns.sort((a, b) => b.date - a.date);
                            setUnRead(unreadCount)
                            setNotifications(ntfcns); 
                        }
                    }
                }
                else {
                    setUnRead(0);
                    setNotifications([]);
                }
            }))
            
            onValue(ref(db, "users-social/users/" + user.uid + "/inbox/friendRequests/"), ( async snapShot => {
                if (snapShot.exists() && snapShot.val()) {
                    let unreadFriendCount = 0;
                    const requests: friend[] = [];
                    const keys = Object.keys(snapShot.val());
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        await get(ref(db, "users-publicInfo/" + key)).then(data => {
                            if (data.exists() && data.val()) {
                                const value = snapShot.val()[key];
                                requests.push({ picture: data.val().profilePicture, name: data.val().displayName, id: key, accepted: value.accepted, date: value.date, read: value.read });
                                if (!value.read) {
                                    unreadFriendCount++;
                                }
                            }
                        });
                        if (i == keys.length - 1) {
                            requests.sort((a, b) => b.date - a.date);
                            setFriendRequests(requests);
                            setunReadFriend(unreadFriendCount)
                        }  
                    }
                }
                else {
                    setunReadFriend(0);
                    setFriendRequests([]);
                }
            }))
        }
    }, [user])

    function changeSegmentedValue(value: string) {
        setSegmentedValue(value);
        if (unreadFriend > 0 && value === "FriendRequests" && user) {
            setunReadFriend(0);
            setUnRead(0);
            const db = getDatabase();
            friendRequests.forEach(request => {
                set(ref(db, "users-social/users/" + user.uid + "/inbox/friendRequests/" + request.id + "/read"), true)
            })
        }
    }

    function handleAccept(id: string) {
        if (user) {
            const db = getDatabase();
            set(ref(db, "users-social/users/" + user.uid + "/friends/" + id), true);
            set(ref(db, "users-social/users/" + id + "/friends/" + user.uid), true);

            // TODO: add posts to friend feed

            set(push(ref(db, "users-social/users/" + id + "/inbox/notifications/")), { code: "accept", id: user.uid, date: Date.now(), read: false })
            set(ref(db, "users-social/users/" + user.uid + "/inbox/friendRequests/" + id + "/accepted"), true);
            remove(ref(db, "users-social/users/" + user.uid + "/pendingFriends/" + id));
            remove(ref(db, "users-social/users/" + id + "/pendingFriends/" + user.uid));
        }
    }

    function handleMailIconPress() {
        setInboxModalVisible(true);
        setSegmentedValue("Notifications");

        if (unread - unreadFriend > 0 && user) {
            setUnRead(unreadFriend);
            const db = getDatabase();
            notifications.forEach(ntfcn => {
                set(ref(db, "users-social/users/" + user.uid + "/inbox/notifications/" + ntfcn.notificationId + "/read"), true)
            })
        }
    }
    //#endregion

    
    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <TouchableOpacity onPress={handleMailIconPress} >
                <Appbar.Action icon="email-outline"  />
                <Badge style={{position: "absolute", top: 10, right: 10}} size={15} visible={unread + unreadFriend != 0} >{unread + unreadFriend}</Badge>
            </TouchableOpacity>

            <Appbar.Content title={title} />

            <Tooltip title="Profile">
                <Appbar.Action icon="account" onPress={() => navigation.navigate("PublicProfile")} />
            </Tooltip>
            <Tooltip title="Friends">
                <Appbar.Action icon="account-group" onPress={() => navigation.navigate("Friends")} />
            </Tooltip>
            <Tooltip title="New Post">
                <Appbar.Action icon="plus" onPress={() => navigation.navigate("CreatePost")} />
            </Tooltip>




            <Modal visible={inboxModalVisible} setVisible={setInboxModalVisible} headerTitle="Inbox" headerButton="Done">
                <View style={styles.container}>
                    <View style={{ width: 325 }}>
                        <SegmentedButtons buttons={[{ value: 'Notifications', icon: 'bell-ring-outline', label: "Notifications   ", showSelectedCheck: true }, { value: 'FriendRequests', icon: 'account-multiple-plus-outline', label: "Friend Requests", showSelectedCheck: true }]} value={segmentedValue} onValueChange={changeSegmentedValue} />
                        <Badge style={{ position: "absolute", top: 0, right: 0 }} size={15} visible={unreadFriend != 0} >{unreadFriend}</Badge>
                    </View>


                    {
                        segmentedValue === "Notifications" &&
                        <FlatList 
                            style={styles.flatList}
                            data={notifications} 
                            keyExtractor={item => item.notificationId}
                            renderItem={({item}) => {
                                function onPress() {
                                    if (item.id) {
                                        setInboxModalVisible(false); 
                                        if (item.postId) {
                                            setTimeout(() => navigation.navigate("PostScreen", { id: item.postId || ""}), 250);
                                        }
                                        else {
                                            setTimeout(() => navigation.navigate("PublicProfile", { id: item.id || "" }), 250);
                                        }
                                    }
                                }

                                return (
                                    <View style={{ width: "100%", backgroundColor: "#F00" }}>
                                        <View style={styles.friendContainer}>
                                            <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: 'center' }} onPress={onPress}>
                                                { item.id && <Avatar.Image size={45} source={item.picture ? { uri: item.picture } : require("../../../assets/images/defaultProfilePic.jpeg")} style={{ margin: 10 }} />}
                                                <Text style={{ width: "50%", flex: 1 }}>{item.message}</Text>
                                                <IconButton icon="chevron-right" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }} 
                            
                            ItemSeparatorComponent={() => <View style={styles.separatorContainer}><View style={styles.separator} /></View>}
                        />
                    }

                    {
                        (segmentedValue === "FriendRequests" && friendRequests.length >= 1) &&
                        <FlatList
                            style={styles.flatList}
                            data={friendRequests}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => {
                                return (
                                    <View style={{width: "100%"}}>
                                        <View style={styles.friendContainer}>
                                            <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: 'center' }} onPress={() => { setInboxModalVisible(false); setTimeout(() => navigation.navigate("PublicProfile", { id: item.id }), 250)}}>
                                                <Avatar.Image size={45} source={item.picture ? { uri: item.picture } : require("../../../assets/images/defaultProfilePic.jpeg")} style={{ margin: 10 }} />
                                                <Text style={{width: "50%", flex: 1}}><Text variant="labelLarge">{item.name}</Text> has requested to be your friend.</Text>
                                            </TouchableOpacity>
                                            <Button onPress={() => handleAccept(item.id)} disabled={item.accepted}>{item.accepted ? "Accepted" : "Accept"}</Button>
                                        </View>
                                    </View>
                                )
                            }}
                            ItemSeparatorComponent={() => <View style={styles.separatorContainer}><View style={styles.separator} /></View>}
                        />
                    }
                    {
                        segmentedValue === "FriendRequests" && friendRequests.length == 0 &&
                        <Text variant="titleLarge" style={{ marginVertical: 20 }}>You don't have any friend requests.</Text>
                    }

                </View>
            </Modal>


        </Appbar.Header>
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
            flex: 1,
            alignItems: 'center', paddingTop: 10, 
        },
        flatList: {
            width: "100%", marginTop: 10
        },
        friendContainer: {
            flexDirection: "row", width: "100%",
            alignItems: 'center',
            backgroundColor: colors.background, 
            padding: 10,
        },
        separatorContainer: {
            paddingLeft: 60, paddingRight: 5, backgroundColor: colors.background
        },
        separator: {
            borderTopWidth: 1, width: "100%", borderColor: colors.outlineVariant
        }
    });
}
function setSnackBar(arg0: { visible: boolean; message: string; action: { label: string; onPressCode: string; }; }) {
    throw new Error("Function not implemented.");
}

