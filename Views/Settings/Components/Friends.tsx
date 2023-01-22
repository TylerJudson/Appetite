import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { get, getDatabase, limitToFirst, onValue, orderByChild, query, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Avatar, IconButton, Searchbar, Text, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserState } from "../../../state";
import { Modal } from "../../components/Modal";
import { RootStackParamList } from "../../navigation";
import { createGlobalStyles } from "../../styles/globalStyles";


// TODO: limit screens to only signed in people

type NavProps = NativeStackScreenProps<RootStackParamList, 'Friends'>;
type navigation = NativeStackNavigationProp<RootStackParamList, "Friends", undefined>
type friend = {
    id: string;
    name: string;
    picture: string;
}


/**
 * Displays a list of the users friends
 * @param navigation The navigation
 */
export function Friends({ navigation }: NavProps) {

    const user = useUserState();
    const globalStyles = createGlobalStyles();

    const colors = useTheme().colors;

    const [friends, setFriends] = useState<friend[]>([]);


    useEffect(() => {
        if (user) {
            const db = getDatabase();
            // Get the list of friends
            onValue(ref(db, "users-social/users/" + user.uid + "/friends"), async (snapshot) => {
                if (snapshot.exists() && snapshot.val()) {

                    const frnds: friend[] = [];
                    const keys = Object.keys(snapshot.val());
                    
                    // For each friend pull in the information need to display them
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        // Get the friend
                        await get(ref(db, "users-publicInfo/" + key)).then(data => {
                            if (data.exists() && data.val()) {
                                // Add the friend to the list
                                frnds.push({ picture: data.val().profilePicture, name: data.val().displayName, id: key } );
                            }
                        });
                        // To prevent sending an empty list we wait till the for loop is finsihed before seeting the list of firends
                        if (i == keys.length - 1) {
                            // Sort by name
                            frnds.sort((a, b) => a.name.localeCompare(b.name));
                            setFriends(frnds);
                        }
                    }
                }
                else {
                    setFriends([]);
                }
            });
        }
    }, [])


    return (
        <View style={globalStyles.container}>
            <Header title="Friends" navigation={navigation} />

            <Animated.FlatList
                //@ts-ignore
                itemLayoutAnimation={Layout}
                data={friends}
                renderItem={({ item }) => {
                    return <PersonWidget name={item.name} picture={item.picture} onPress={() => navigation.navigate("PublicProfile", { id: item.id })} />
                }}
                ItemSeparatorComponent={() => <Animated.View entering={FadeIn.delay(100)} style={{ width: "100%", paddingLeft: 90, paddingRight: 10 }}><View style={{ width: "100%", borderTopWidth: 0.5, borderColor: colors.outline }} /></Animated.View>}
            />
        </View>
    )
}




/** 
 * Creates a header with a simple back button and an add friend button in the top left
 * @param title the optional title to display in the center
 * @param navigation THe navigation
 */
function Header({ title, navigation }: { title?: string, navigation: navigation }) {
    const insets = useSafeAreaInsets();
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} mode="center-aligned" />
            <Appbar.Action onPress={() => setAddFriendModalVisible(true)} icon="account-plus" />
            <AddFriendModal visible={addFriendModalVisible} setVisible={setAddFriendModalVisible} navigation={navigation} />
        </Appbar.Header>
    )
}




/**
 * Creates a add friend modal where the user can look up people
 * @param visible Whether or not the modal is visible
 * @param setVisible The function to set the visibility of the modal
 * @param naviagtion The navigation
 */
function AddFriendModal({visible, setVisible, navigation}: {visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>, navigation: navigation}) {
    
    const user = useUserState();

    const colors = useTheme().colors;
    const [search, setSearch] = useState("");

    const [masterList, setMasterList] = useState<friend[]>([])
    const [list, setList] = useState<friend[]>([]);

    useEffect(() => {
        // Only get the list of users when the modal is visible
        if (visible) {
            const db = getDatabase();
            get(ref(db, "users-publicInfo")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {

                    const people: friend[] = [] 
                    Object.keys(snapshot.val())
                                    .map((key: any) => {
                                        // Check to make sure the person isn't the user
                                        if (key !== user?.uid) {
                                            let value = snapshot.val()[key];
                                            people.push( {
                                                name: value.displayName,
                                                id: key,
                                                picture: value.profilePicture
                                            } )
                                        }
                                    });
                                    
                    setMasterList(people);
                    setList(people);
                }
            })
        }
    }, [visible])

    /**
     * handles the action of searching
     * @param text The string to filter the list with
     */
    function onSearch(text: string) {
        setSearch(text);
        const filteredList = masterList.filter(value => value.name.toUpperCase().includes(text.toUpperCase()));
        setList(filteredList);
    }

    const styles = StyleSheet.create({
        searchBar: {
            margin: 10,
            height: 40
        }
    });


    return (
        <Modal visible={visible} setVisible={setVisible} headerTitle="Add Friend" headerButton="Done">
            <Searchbar style={styles.searchBar} value={search} onChangeText={text => onSearch(text)} placeholder="Search People"  />
                <Animated.FlatList
                    //@ts-ignore
                    itemLayoutAnimation={Layout} 
                    data={list}
                    renderItem={({ item }) => {
                        return <PersonWidget small name={item.name} picture={item.picture} onPress={() => { setVisible(false); setTimeout(() => navigation.navigate("PublicProfile", { id: item.id }), 250);}}/>
                    }}
                ItemSeparatorComponent={() => <Animated.View entering={FadeIn.delay(100)} style={{width: "100%", paddingLeft: 50, paddingRight: 10}}><View style={{width: "100%", borderTopWidth: 0.25, borderColor: colors.outline}}/></Animated.View>}
                />
        </Modal>
    )
}




/**
 * Creates a clickable widget with a person's picture and name
 * @param name The name of the person
 * @param picture The picture of the person
 * @param onPress THe function to call when the user clicks on the widget
 * @param small Whether or not to display the people smaller
 */
function PersonWidget({name, picture="", onPress, small=false}: {name: string, picture?: string, onPress: VoidFunction, small?: boolean}) {



    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        title: {
            flex: 1
        }
    
    });

    return (
        <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut} >
            <TouchableOpacity style={styles.container} onPress={onPress} >
                <Avatar.Image size={small ? 30 : 75} source={picture ? { uri: picture } : require("../../../assets/images/defaultProfilePic.jpeg")} style={{ margin: 10 }} />
                <Text variant={small ? "labelLarge" : "titleLarge"} style={styles.title}>{name}</Text>
                <IconButton icon="chevron-right" size={small ? undefined : 40 }/>
            </TouchableOpacity>
        </Animated.View>
    )

} 