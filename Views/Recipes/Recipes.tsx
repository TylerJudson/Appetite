import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated as animated, Easing, TextInput } from "react-native";
import { useTheme, Searchbar, Text, FAB } from "react-native-paper";
import { Route } from "../navigation";
import { Header } from "./Components/Header";
import { useRecipeBookState } from "../../state";
import { Widget } from "./Components/Widget";
import { createGlobalStyles } from "../styles/globalStyles";
import { filterObject } from "../../utilities/filter";
import { Recipe } from "../../Models/Recipe";

import Animated, { Layout } from "react-native-reanimated";

/**
 * Shows a list of the recipes for the user.
 * @param param0 the navigation so the user can navigate between screens
 */
export default function Recipes({ route }: Route) {
    const { recipeBook } = useRecipeBookState();

    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    
    const [viewFavorites, setViewFavorites] = useState(false); // Whether or not to show only the favorite recipes or not
    const [tags, setTags] = useState<string[]>([]); // The tags to filter the list of recipes by
    const [search, setSearch] = useState(""); // The query in the search bar
    const [searching, setSearching] = useState(false); // If the user is currently searching recipes
    const [filteredRecipes, setFilteredRecipes] = useState(recipeBook.recipes); // The list of recipes to display

    const animSearchBar = useRef(new animated.Value(0)).current;
    const searchBar = useRef<TextInput>() as MutableRefObject<TextInput>;

    //#region BEHAVIOR

    /**
     * Filters the recipe list by favorite then tags then the search query
     */
    function filter() {
        setFilteredRecipes(filterObject(recipeBook.recipes, (recipe: Recipe) => {
            let ret = true;
            // If we want to show only the favorites
            if (viewFavorites) {
                ret = recipe.favorited;
            }
            // If there are any tags to display
            if (tags) {
                // ret = ret && recipe.tags.includes(tags[0]) // TODO: Implement this
            }
            // If the search bar is not empty only filter the list by the query
            if (search != "") {
                ret = ret && recipe.name.toUpperCase().indexOf(search.toUpperCase()) > -1;
            }
            return ret;
        }));
    }

    // Run filter whenever recipebook, viewFavorites, search, or tags change
    useEffect(filter, [recipeBook, viewFavorites, search, tags]);

    /**
     * Toggles the focus of the search bar
     */
    function toggleSearch() {
        if (searching) {
            setSearch("");
            searchBar.current.blur();
            SearchAnimaionBlur.start(() => setSearching(false));
        }
        else {
            setSearching(true);
            searchBar.current.focus();
            SearchAnimationFocus.start();
        }
    }

    // Animates the focus of the search bar
    const SearchAnimationFocus = animated.timing(
        animSearchBar,
        {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }
    );

    // Animates the blur of the search bar
    const SearchAnimaionBlur = animated.timing(
        animSearchBar,
        {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }
    );

    //#endregion


    return (
        <View style={globalStyles.container}>
            <Header viewFavorites={viewFavorites} setViewFavorites={setViewFavorites} toggleSearch={toggleSearch} tags={tags} setTags={setTags} />

            <Animated.FlatList  
                data={Object.values(filteredRecipes).sort(sortAlpha)}
                renderItem={ ({item}) => {
                    return <Widget recipe={item} onPress={() => route.navigation.navigate("Recipe", { recipe: item })} />
                }}
                //@ts-ignore
                itemLayoutAnimation={Layout} 
                numColumns={1}
                ListHeaderComponent={
                    <View style={{overflow: "hidden" }}>
                        <animated.View style={{
                                transform: [{translateY: animSearchBar.interpolate({inputRange: [0, 1], outputRange: [0, -50]})}], 
                                opacity: animSearchBar.interpolate({inputRange: [0, 1], outputRange: [1, 0]}),
                                position: searching ? "absolute" : 'relative'}}
                        >
                            <Text style={styles.title} variant="headlineLarge">Recipes</Text>
                        </animated.View>

                        <animated.View style={{
                            transform: [{translateY: animSearchBar.interpolate({inputRange: [0, 1], outputRange: [55, 0]})}],
                            opacity: animSearchBar.interpolate({inputRange: [0, 1], outputRange: [-0.5, 1]}),
                            position: searching ? "relative" : "absolute"}} 
                        >
                            <Searchbar style={styles.searchBar} placeholder="Search Recipes" onChangeText={(value) => setSearch(value)} value={search} ref={searchBar} />
                        </animated.View>

                    </View>
                }
            />

            <FAB
                icon="plus"
                variant="surface"
                style={styles.fab}
                size="small"
                visible={true}
                onPress={() => route.navigation.navigate("EditCreate", {})}
            />


            

        </View>
    );
}



/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        title: {
            margin: 10
        },
        searchBar: {
            margin: 10,
            height: 40,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
    });
}

function sortAlpha(a: Recipe, b: Recipe) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}