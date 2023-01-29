import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";
import { Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";
import { SearchModal } from "./Components/SearchModal";




/**
 * This shows a discover screen
 * @param route The navigation to let the app navigate between screens
 */
export default function Discover({ route }: Route) {

    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [tags, setTags] = useState<string[]>([]);


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

                <View style={{height: 1000}}></View>
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
    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            marginLeft: 15
        },
    });
}




function sortAlpha(a: Recipe, b: Recipe) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}