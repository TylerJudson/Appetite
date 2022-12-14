import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { Appbar, Divider, Menu, Tooltip, SegmentedButtons, Snackbar } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";
import { RecipeBook } from "../../Models/RecipeBook";
import { useRecipeBookState } from "../../state";
import { RootStackParamList } from "../navigation";


// TODO: documentation and fix statusBarHeight
export function RecipeHeader({ value, setValue }: { value: string, setValue: Dispatch<SetStateAction<string>> }) {

    /**
      Handles the action of pressing the search button
     */
    function handleSearch() {
        console.log("Not yet implemented");
    }


    return (
        <Appbar.Header elevated statusBarHeight={30}>
            <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                <Tooltip title="Tags">
                    <Appbar.Action icon={"tag-multiple"} onPress={handleSearch} />
                </Tooltip>

                <View style={{alignSelf: "center"}}>
                    <SegmentedButtons 
                        value={value}
                        onValueChange={setValue}
                        density="small"
                        
                        buttons={[
                            {
                                value: "All Recipes",
                                label: "All Recipes",
                                icon: "format-list-bulleted",
                                showSelectedCheck: true
                            },
                            {
                                value: "Favorites",
                                label: "Favorites",
                                icon: "heart",
                                showSelectedCheck: true
                            }
                        ]}
                        
                        />
                </View>

                <Tooltip title="Search">
                    <Appbar.Action icon={"card-search"} onPress={handleSearch} />
                </Tooltip>
            </View>
        </Appbar.Header>
    )
}



type navProps = NativeStackNavigationProp<RootStackParamList, 'Recipe'>;
interface ViewRecipeHeader {
    /** The navigation for the screen */
    navigation: navProps
    /** The recipe (so the user can save or send it.) */
    recipe: Recipe
}


/**
 * Creates a header with a back button and controls for the recipe
 * @param param0 The navigation and recipe
 */
export function ViewRecipeHeader({ navigation, recipe }: ViewRecipeHeader ) {
    /** Whether the menu is visible or not. */
    const [menuVisible, setMenuVisible] = React.useState(false);
    const { recipeBook, setRecipeBook } = useRecipeBookState();

    /** Handles the action of pressing the heart */
    function handleHeart() {
        console.log("Not yet implemented");
    }
    /** Handles the action of sharing the recipe */
    function handleShare() {
        console.log("Not yet implemented");
    }
    /** Handles the action of saving the recipe */
    function handleSave() {
        // recipeBook.recipes.push(recipe);
        const test = new RecipeBook(recipeBook.recipes);
        test.recipes.push(recipe);
        setRecipeBook(test);
    }
    /** Handles the action of editting the recipe */
    function handleEdit() {
        console.log("Not yet implemented");
    }
    /** Handles the action of adding and viewing tags */
    function handleTags() {
        console.log("Not yet implemented");
    }
    /** Handles the action of deleteing the recipe */
    function handleDelete() {
        console.log("Not yet implemented");
    }
    /** Toggles the menu */
    function toggleMenu() {
        setMenuVisible(!menuVisible);
    }
   

    return (
        <Appbar.Header elevated statusBarHeight={30}>
            {/** This is the button that allows the user to go back to the previous screen */}
            <Tooltip title="Back">
                <Appbar.BackAction onPress={navigation.goBack} />
            </Tooltip>

            {/** The title for the header is blank */}
            <Appbar.Content title="" />

            {/** Depending on if the recipe is readonly or not display the header differently*/}
            { recipe.readonly ?
                // If the header is readonly: display a save and a share button.
                <>
                    <Tooltip title="Save">
                        <Appbar.Action icon="download" onPress={handleSave} />
                    </Tooltip>
                    <Tooltip title="Share">
                        <Appbar.Action icon="share" onPress={handleShare} />
                    </Tooltip>
                </>
                :
                // If the header is not readonly: then show the favorites button and the more button
                <>
                    <Tooltip title="Favorite">
                        <Appbar.Action icon={false ? "heart" : "heart-outline"} onPress={handleHeart} />
                    </Tooltip>

                    {/** The more button opens a menu with more options. // TODO: Something is wrong with this tooltip */}
                    <Tooltip title="More">
                        <Menu
                            visible={menuVisible}
                            onDismiss={toggleMenu}
                            anchor={<Appbar.Action icon="dots-vertical" onPress={toggleMenu} />}
                            anchorPosition="bottom"
                        >
                            
                            <Menu.Item leadingIcon="lead-pencil"  onPress={handleEdit}  title="Edit" />
                            <Menu.Item leadingIcon="tag-multiple" onPress={handleTags}  title="Tags" />
                            <Menu.Item leadingIcon="share"        onPress={handleShare} title="Share" />
                            <Divider />
                            <Menu.Item leadingIcon="trash-can-outline" onPress={handleDelete} title="Delete" />
                        </Menu>
                    </Tooltip>
                </>
            }

        </Appbar.Header>
    );
}