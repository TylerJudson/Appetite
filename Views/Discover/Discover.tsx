import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, IconButton, Searchbar, Text, useTheme } from "react-native-paper";
import Animated, { Layout } from "react-native-reanimated";
import { Recipe } from "../../Models/Recipe";
import { Modal } from "../components/Modal";
import { Route } from "../navigation";
import { Widget } from "./Components/Widget";
import { createGlobalStyles } from "../styles/globalStyles";
import { endAt, get, getDatabase, limitToFirst, orderByChild, query, ref, startAt } from "firebase/database";




/**
 * This shows a discover screen
 * @param route The navigation to let the app navigate between screens
 */
export default function Discover({ route }: Route) {

    const globalStyles = createGlobalStyles();
    const styles = createStyles();


    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    const [list, setList] = useState<{name: string, id: string, image: string}[]>([]);

    function onSearch(value: string) {
        setSearch(value);
        const db = getDatabase();
        const listQuery = query(ref(db, "publicRecipes/shallow/"), orderByChild("name"), startAt(value), endAt(value + "\uf8ff"), limitToFirst(10))
        get(listQuery)
        .then((snapShot) => {
            if (snapShot.exists() && snapShot.val()) {
                setList((Object.values(snapShot.val()) as any).sort(sortAlpha));
            }
        })
    }



    function onSearchWidgetPress(id: string, image: string) {
        setSearchModalVisible(false);
        const db = getDatabase();

        get(ref(db, "/publicRecipes/deep/" + id))
        .then(snapshot => {
            if (snapshot.exists() && snapshot.val()) {
                let x = snapshot.val();
                const rec = new Recipe(x.name, x?.ingredients || [], x?.instructions || [], x.description, image, x.id, x.prepTime, x.cookTime, x.favorited, x?.tags || [], true);
                setTimeout(() => route.navigation.navigate("Recipe", { recipe: rec }), 0)
            }
        })
        .catch(reason => console.log(reason));
    }
    
    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView stickyHeaderIndices={[1]} >
                <View style={{marginTop: 30}}/>
                <View>
                    <View style={styles.headerContainer} >
                        <Text variant="headlineLarge" style={{ flex: 1}}>Discover</Text>
                        <IconButton icon="magnify" onPress={() => {setSearchModalVisible(true); onSearch("")}}/>
                    </View>
                </View>

                <View style={{height: 1000}}></View>
            </ScrollView>





            <Modal visible={searchModalVisible} setVisible={setSearchModalVisible} >
                <View style={styles.searchContainer}>
                    <View style={{ flex: 1 }}>
                        <Searchbar style={styles.searchBar} value={search} onChangeText={text => onSearch(text)}  placeholder="Search Recipes"  autoFocus autoCapitalize="words"/>
                    </View>
                    <Button onPress={() => {setSearchModalVisible(false); onSearch("");}}>Done</Button>
                </View>

                <Animated.FlatList
                    style={styles.list}
                    scrollEnabled={false}
                    data={list}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return <Widget title={item.name} image={item.image} recipeId={item.id} onPress={() => onSearchWidgetPress(item.id, item.image)} />
                    }}
                    //@ts-ignore
                    itemLayoutAnimation={Layout}
                />

            </Modal>
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            marginLeft: 15
        },
        searchContainer: {
            flexDirection: "row", alignItems: "center", 
            marginTop: 15, marginLeft: 10
        },
        searchBar: {
            height: 40,
        },
        list: {
            marginTop: 10
        }
    });
}




function sortAlpha(a: Recipe, b: Recipe) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}