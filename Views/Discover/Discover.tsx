import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";
import { Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";
import { RecipeList } from "./Components/RecipeList";
import { SearchModal } from "./Components/SearchModal";
import { TagGrid, tagCard } from "./Components/TagGrid";




/**
 * This shows a discover screen
 * @param route The navigation to let the app navigate between screens
 */
export default function Discover({ route }: Route) {

    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [tags, setTags] = useState<string[]>(["dfjdk"]);

    function openSearchModalWithTag(tag: string) {
        setSearchModalVisible(true);
        setTags([tag]);
    }

    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView stickyHeaderIndices={[1]} >

                <View style={{marginTop: 30}}/>
                <View>
                    <View style={styles.headerContainer} >
                        <Text variant="headlineLarge" style={{ flex: 1}}>Discover</Text>
                        <IconButton icon="magnify" onPress={() => setSearchModalVisible(true)}/>
                    </View>
                </View>

                <RecipeList style={styles.recipeList} header="Check out these Featured Recipes" source="" recipeCount={5} />

                <TagGrid openSearchModalWithTag={openSearchModalWithTag} tagCards={foodOrginTags} />

            </ScrollView>

            <SearchModal visible={searchModalVisible} setVisible={setSearchModalVisible} navigation={route.navigation} tags={tags} setTags={setTags} />
        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;

    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            paddingLeft: 15,
            backgroundColor: colors.background
        },
        recipeList: {

        },

    });
}




const foodOrginTags: tagCard[] = [
    { title: "Mexican", image: require("../../assets/images/flags/mexicanFlag.jpg")},
    { title: "Chinese", image: "" },
    { title: "Italian", image: "" },
    { title: "German", image: "" },
    { title: "Japanese", image: "" },
    { title: "French", image: "" },
    { title: "Korean", image: "" },
    { title: "Indian", image: "" },
    { title: "Thai", image: "" },
    { title: "African", image: "" },
    { title: "Greek", image: "" },
    { title: "Pakistani", image: ""},
]