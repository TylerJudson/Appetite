import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { get, getDatabase, limitToFirst, orderByChild, query, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Avatar, IconButton, Searchbar, Text } from "react-native-paper";
import Animated, { Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal } from "../../components/Modal";
import { RootStackParamList } from "../../navigation";
import { createGlobalStyles } from "../../styles/globalStyles";




type NavProps = NativeStackScreenProps<RootStackParamList, 'Friends'>;

// TODO: docs
export function Friends({ navigation }: NavProps) {

    const globalStyles = createGlobalStyles();


    return (
        <View style={globalStyles.container}>
            <Header title="Friends" onBack={navigation.goBack} />


        </View>
    )
}




/** // TODO: docs
 * Creates a header with a simple back button and an optional title and button
 * @param title the optional title to display in the center
 */
function Header({ title, onBack }: { title?: string, onBack: VoidFunction }) {
    const insets = useSafeAreaInsets();
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <Appbar.BackAction onPress={onBack} />
            <Appbar.Content title={title} mode="center-aligned" />
            <Appbar.Action onPress={() => setAddFriendModalVisible(true)} icon="plus" />

            <AddFriendModal visible={addFriendModalVisible} setVisible={setAddFriendModalVisible} />
        </Appbar.Header>
    )
}




function AddFriendModal({visible, setVisible}: {visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    
    type people = {
        id: string;
        name: string;
        picture: string;
    }

    const [search, setSearch] = useState("");

    const [masterList, setMasterList] = useState<people[]>([])
    const [list, setList] = useState<people[]>([]);

    useEffect(() => {
        if (visible) {
            const db = getDatabase();
            get(ref(db, "users-publicInfo")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    const people = Object.values(snapshot.val()).sort((a: any, b: any) => {if (a.displayName < b.displayName) return -1; if (a.displayName > b.displayName) return 1; return 0 })
                                    .map((value: any) => {
                                        return {
                                            name: value.displayName,
                                            id: value.id,
                                            picture: value.profilePicture
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
                        return <PersonWidget id={item.id} name={item.name} picture={item.picture} />
                    }}
                />
        </Modal>
    )
}






function PersonWidget({id, name, picture=""}: {id: string, name: string, picture?: string}) {



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
        <TouchableOpacity style={styles.container} onPress={undefined} >
            <Avatar.Image size={30} source={picture ? { uri: picture } : require("../../../assets/images/defaultProfilePic.jpeg")} style={{ margin: 10 }} />
            <Text variant="labelLarge" style={styles.title}>{name}</Text>
            <IconButton icon="chevron-right" />
        </TouchableOpacity>
    )

} 