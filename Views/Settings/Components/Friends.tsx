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

// TODO: docs
export function Friends({ navigation }: NavProps) {

    const user = useUserState();
    const globalStyles = createGlobalStyles();

    const colors = useTheme().colors;

    const [friends, setFriends] = useState<friend[]>([]);

    useEffect(() => {
        if (user) {
            const db = getDatabase();
            onValue(ref(db, "users-social/users/" + user.uid + "/friends"), async (snapshot) => {
                if (snapshot.exists() && snapshot.val()) {

                    const frnds: friend[] = [];
                    const keys = Object.keys(snapshot.val());
                    
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        await get(ref(db, "users-publicInfo/" + key)).then(data => {
                            if (data.exists() && data.val()) {
                                frnds.push({ picture: data.val().profilePicture, name: data.val().displayName, id: key } );
                            }
                        });
                        if (i == keys.length - 1) {
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
            <Header title="Friends" onBack={navigation.goBack} navigation={navigation} />

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




/** // TODO: docs
 * Creates a header with a simple back button and an optional title and button
 * @param title the optional title to display in the center
 */
function Header({ title, onBack, navigation }: { title?: string, onBack: VoidFunction, navigation: navigation }) {
    const insets = useSafeAreaInsets();
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <Appbar.BackAction onPress={onBack} />
            <Appbar.Content title={title} mode="center-aligned" />
            <Appbar.Action onPress={() => setAddFriendModalVisible(true)} icon="plus" />

            <AddFriendModal visible={addFriendModalVisible} setVisible={setAddFriendModalVisible} navigation={navigation} />
        </Appbar.Header>
    )
}



// TODO: docs
function AddFriendModal({visible, setVisible, navigation}: {visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>, navigation: navigation}) {
    
    const user = useUserState();

    const colors = useTheme().colors;
    const [search, setSearch] = useState("");

    const [masterList, setMasterList] = useState<friend[]>([])
    const [list, setList] = useState<friend[]>([]);

    useEffect(() => {
        if (visible) {
            const db = getDatabase();
            get(ref(db, "users-publicInfo")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {

                    const people: friend[] = [] 
                    Object.keys(snapshot.val())
                                    .map((key: any) => {
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





// TODO: Docs
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