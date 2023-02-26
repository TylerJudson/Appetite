import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { IconButton, Snackbar, Text, useTheme } from "react-native-paper";
import { updateRecipe } from "../../FireBase/Update";
import { Recipe } from "../../Models/Recipe";
import { useRecipeBookState, useUserState } from "../../state";
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

    const [snackBar, setSnackBar] = useState({
        visible: false,
        message: ""
    });

    function openSearchModalWithTag(tag: string) {
        setSearchModalVisible(true);
        setTags([tag]);
    }



    return (
        <View style={globalStyles.screenContainer}>
            <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{paddingBottom: 100}}>

                <View style={{marginTop: 30}}/>
                <View>
                    <View style={styles.headerContainer} >
                        <Text variant="headlineLarge" style={{ flex: 1}}>Discover</Text>
                        <IconButton icon="magnify" onPress={() => setSearchModalVisible(true)}/>
                    </View>
                </View>

                <RecipeList style={styles.recipeList} header="Check out these Featured Recipes" source="/discover/featuredRecipes" recipeCount={5} navigation={route.navigation} setSnackBar={setSnackBar} />

                <TagGrid openSearchModalWithTag={openSearchModalWithTag} tagCards={meals} />

                <RecipeList style={styles.recipeList} header="Popular Recipes" source="/discover/popularRecipes" recipeCount={5} navigation={route.navigation} setSnackBar={setSnackBar} />

                <RecipeList style={styles.recipeList} header="Let's be healthy!" source="/discover/beHealthy" recipeCount={4} navigation={route.navigation} setSnackBar={setSnackBar} />

                <RecipeList style={styles.recipeList} header="Get your Green on with some St. Patrick's Day Recipes" source="/discover/stPatricks" recipeCount={4} navigation={route.navigation} setSnackBar={setSnackBar} />

                <RecipeList style={styles.recipeList} header="Eat from around the world" source="/discover/aroundWorld" recipeCount={4} navigation={route.navigation} setSnackBar={setSnackBar} />

                <TagGrid openSearchModalWithTag={openSearchModalWithTag} tagCards={foodOrginTags} />
                
                <RecipeList style={styles.recipeList} header="Try these difficult recipes" source="/discover/difficult" recipeCount={4} navigation={route.navigation} setSnackBar={setSnackBar} />

                <RecipeList style={styles.recipeList} header="Quick and easy" source="/discover/easy" recipeCount={4} navigation={route.navigation} setSnackBar={setSnackBar} />

                <TagGrid openSearchModalWithTag={openSearchModalWithTag} tagCards={timeTags} />

                <RecipeList style={styles.recipeList} header="Vegan delights" source="/discover/vegan" recipeCount={3} navigation={route.navigation} setSnackBar={setSnackBar} />

                <RecipeList style={styles.recipeList} header="No carbs?!!" source="/discover/noCarbs" recipeCount={3} navigation={route.navigation} setSnackBar={setSnackBar} />
            </ScrollView>

            <SearchModal visible={searchModalVisible} setVisible={setSearchModalVisible} navigation={route.navigation} tags={tags} setTags={setTags} />

            <Snackbar
                visible={snackBar.visible}
                onDismiss={() => { setSnackBar({ ...snackBar, visible: false }) }}
                duration={3000}
            >
                {snackBar.message}
            </Snackbar>
            
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
            marginTop: 20
        },

    });
}




const foodOrginTags: tagCard[] = [
    { title: "Mexican",     image: require("../../assets/images/flags/mexicanFlag.jpg")},
    { title: "Chinese",     image: require("../../assets/images/flags/chineseFlag.jpg") },
    { title: "Italian",     image: require("../../assets/images/flags/italianFlag.jpg") },
    { title: "German",      image: require("../../assets/images/flags/germanFlag.jpg") },
    { title: "Japanese",    image: require("../../assets/images/flags/japaneseFlag.jpg") },
    { title: "French",      image: require("../../assets/images/flags/frenchFlag.jpg") },
    { title: "Korean",      image: require("../../assets/images/flags/koreanFlag.jpg") },
    { title: "Indian",      image: require("../../assets/images/flags/indianFlag.jpg") },
    { title: "Thai",        image: require("../../assets/images/flags/thaiFlag.jpg") },
    { title: "African",     image: require("../../assets/images/flags/africanFlag.jpg") },
    { title: "Greek",       image: require("../../assets/images/flags/greekFlag.jpg") },
    { title: "Pakistani",   image: require("../../assets/images/flags/pakistanFlag.jpg")},
]

const meals: tagCard[] = [
    { title: "Breakfast", image: require("../../assets/images/meals/Breakfast.jpg") },
    { title: "Lunch", image: require("../../assets/images/meals/Lunch.jpg") },
    { title: "Dinner", image: require("../../assets/images/meals/Dinner.jpg") },
    { title: "Dessert", image: require("../../assets/images/meals/Dessert.jpg") },
    { title: "Snack", image: require("../../assets/images/meals/Snack.jpg") },
]

const timeTags: tagCard[] = [
    { title: "<10 Mins", },
    { title: "<30 Mins", },
    { title: "1 Hour", }
]