import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, IconButton, Searchbar, Text, useTheme } from "react-native-paper";
import Animated, { Layout } from "react-native-reanimated";
import { Recipe } from "../../Models/Recipe";
import { Modal } from "../components/Modal";
import { Route } from "../navigation";
import Widget from "../Recipes/Components/Widget";
import { createGlobalStyles } from "../styles/globalStyles";



const Pizza = new Recipe("Air-Fryer Sausage Pizza",
    ["1 loaf frozen bread dough, thawed", "1 cup pizza sauce", "1/2 pound bulk Italian sausage, cooked and drained", "1-1/3 cups shredded part-skim mozzarella cheese", "1 small green pepper, sliced into rings", "1 tsp dried oregano", "Crushed red pepper flakes, optional"],
    ["On a lightly floured surface, roll and stretch dough into four 4-in. circles. Cover; let rest for 10 minutes.", "Preheat air fryer to 400°. Roll and stretch each dough into a 6-in. circle. Place 1 crust on greased tray in air-fryer basket. Carefully spread with 1/4 cup pizza sauce, 1/3 cup sausage, 1/3 cup cheese, a fourth of the green pepper rings and a pinch of oregano. Cook until crust is golden brown, 6-8 minutes. If desired, sprinkle with red pepper flakes. Repeat with remaining ingredients."],
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mollis ac magna ut fringilla. Suspendisse tincidunt tincidunt turpis, non ultrices mauris laoreet ut. Morbi sit amet gravida nunc. Vestibulum sollicitudin est eu risus consequat euismod. Quisque vel porttitor arcu. Nullam finibus justo lacus, et fermentum arcu fermentum vitae. Maecenas sit amet fringilla lectus. Quisque sit amet accumsan ex. Donec efficitur sapien non nisi congue tempor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam erat volutpat. Aenean semper est vel dui efficitur, vitae pretium est venenatis. Cras tellus ligula, tincidunt lacinia sodales sed, ultricies eget eros. Nulla facilisi. Proin mattis massa eget eros elementum ultrices. Mauris tincidunt quam sit amet pretium placerat.",
    undefined, undefined,
    30, 10, false, ["Pizza", "Supper", "Air-Fryer"], true)




/**
 * This shows a discover screen
 * @param route The navigation to let the app navigate between screens
 */
export default function Discover({ route }: Route) {

    const globalStyles = createGlobalStyles();
    const styles = createStyles();


    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    function onSearch(value: string) {
        setSearch(value);
        if (value.length > 0) {

        }
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

                <View style={{height: 1000}}></View>
            </ScrollView>





            <Modal visible={searchModalVisible} setVisible={setSearchModalVisible} >
                <View style={styles.searchContainer}>
                    <View style={{ flex: 1 }}>
                        <Searchbar style={styles.searchBar} value={search} onChangeText={text => onSearch(text)}  placeholder="Search Recipes"  autoFocus/>
                    </View>
                    <Button onPress={() => setSearchModalVisible(false)}>Done</Button>
                </View>

                <Animated.FlatList
                    style={styles.list}
                    data={[Pizza]}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return <Widget recipe={item} onPress={() => { setSearchModalVisible(false); setTimeout(() => route.navigation.navigate("Recipe", { recipe: item }), 250)}} />
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
