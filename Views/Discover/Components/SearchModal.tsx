import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getDatabase, get, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import { Recipe } from "../../../Models/Recipe";
import { Modal } from "../../components/Modal";
import { RootStackParamList } from "../../navigation";
import { Widget } from "./Widget";
import Animated, { Layout } from "react-native-reanimated";
import { Tags } from "../../Recipes/Components/Tags";
import { BottomModal } from "../../components/BottomModal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatedTag } from "../../Recipes/Components/AnimatedTag";





export function SearchModal({ visible, setVisible, navigation, tags, setTags }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>, navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined>, tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>>}) {
    
    const styles = createStyles();
    
    const [tagsModalVisible, setTagsModalVisible] = useState(false);
    
    const [search, setSearch] = useState("");

    const [masterList, setMasterList] = useState<{ name: string, id: string, image: string, tags: string[] }[]>([]);
    const [list, setList] = useState(masterList);

    useEffect(filter, [search, tags]);
    useEffect(getRecipes, [visible])


    /** Get's all of the public recipes from the database */
    function getRecipes() {
        if (visible) {
            setTags([]);
            setSearch("");
            const db = getDatabase();
            get(ref(db, "publicRecipes/shallow/"))
                .then((snapShot) => {
                    if (snapShot.exists() && snapShot.val()) {
                        setMasterList((Object.values(snapShot.val()).sort(sortAlpha) as any));
                        setList((Object.values(snapShot.val()).sort(sortAlpha) as any));
                    }
                })
        }
    }

    /** Filters the list of recipes by a search string and tags */
    function filter() {
        setList(masterList.filter(item => {
            let ret = true;
            if (tags.length != 0) {
                ret = item.tags && tags.every(tag => item.tags.includes(tag));
            }
            if (search) {
                ret = ret && item.name.toUpperCase().indexOf(search.toUpperCase()) > -1;
            }
            return ret;
        }))
    }
   
    function onSearchWidgetPress(id: string, image: string) {
        setVisible(false);
        const db = getDatabase();

        get(ref(db, "/publicRecipes/deep/" + id))
            .then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    let x = snapshot.val();
                    const rec = new Recipe(x.name, x?.ingredients || [], x?.instructions || [], x.description, image, x.id, x.prepTime, x.cookTime, x.favorited, x?.tags || [], true);
                    setTimeout(() => navigation.navigate("Recipe", { recipe: rec }), 250)
                }
            })
            .catch(reason => console.log(reason));
    }

    /**
     * Removes a tag from the filtering tags
     * @param tag The tag to remove from the filtering Tags
     */
    function removeTag(tag: string) {

        let newTags: string[] = [];
        tags.forEach((value) => {
            if (value != tag) {
                newTags.push(value);
            }
        })

        setTags(newTags);
    }

    return (
        <Modal visible={visible} setVisible={setVisible} >
            <View style={styles.searchContainer}>
                <View style={{ flex: 1 }}>
                    <Searchbar style={styles.searchBar} 
                        icon="filter-variant"
                        onIconPress={() => {setTagsModalVisible(true); Keyboard.dismiss()}}
                        value={search} 
                        onChangeText={setSearch} 
                        placeholder="Search Recipes" 
                        autoFocus 
                        autoCapitalize="words" 
                    />
                </View>
                <Button onPress={() => setVisible(false)}>Done</Button>
            </View>

            <Animated.FlatList
                style={styles.list}
                data={list}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return <Widget title={item.name} image={item.image} onPress={() => onSearchWidgetPress(item.id, item.image)} />
                }}
                //@ts-ignore
                itemLayoutAnimation={Layout}
                ListHeaderComponent={
                    <Animated.FlatList
                        data={tags}
                        style={styles.tagContainer}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return <AnimatedTag title={item} onPress={() => removeTag(item)} remove />
                        }}

                    />
                }
            />

            <SafeAreaProvider>
                
            <BottomModal visible={tagsModalVisible} setVisible={setTagsModalVisible}>
                <Tags title="Filters" clear tags={tags} setTags={setTags} addTags />
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
    return StyleSheet.create({
        searchContainer: {
            flexDirection: "row", alignItems: "center",
            marginTop: 15, marginLeft: 10
        },
        searchBar: {
            height: 40,
        },
        list: {
            marginTop: 10
        },
        tagContainer: {
            margin: 5
        },
    });
}




function sortAlpha(a: any, b: any) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}