import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";
import { Appbar, Divider, Menu, Tooltip, SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../Models/Recipe";
import { useRecipeBookState } from "../../state";
import { RootStackParamList } from "../navigation";


// TODO: documentation and fix statusBarHeight
export function RecipesHeader({ value, setValue, toggleSearch }: { value: boolean, setValue: Dispatch<SetStateAction<boolean>>, toggleSearch: VoidFunction }) {
    const insets = useSafeAreaInsets();

    /**
      Handles the action of pressing the search button
     */
    function handleSearch() {
        console.log("Not yet implemented");
    }


    return (
        <Appbar.Header elevated statusBarHeight={insets.top - 15}>
            <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                <Tooltip title="Tags">
                    <Appbar.Action icon={"filter-variant"} onPress={handleSearch} />
                </Tooltip>

                <View style={{alignSelf: "center"}}>
                    <SegmentedButtons 
                        value={value ? "Favorites" : "All Recipes"}
                        onValueChange={(value) => {setValue(value === "Favorites")}}
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
                    <Appbar.Action icon={"card-search"} onPress={toggleSearch} />
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
    /** Gives the header the ability to set the state of the snackbar */
    setSnackBar: React.Dispatch<React.SetStateAction<{
        visible: boolean;
        message: string;
    }>>
}


/**
 * Creates a header with a back button and controls for the recipe
 * @param param0 The navigation and recipe
 */
export function ViewRecipeHeader({ navigation, recipe, setSnackBar }: ViewRecipeHeader ) {
    /** Whether the menu is visible or not. */
    const [menuVisible, setMenuVisible] = useState(false);
    const { recipeBook, setRecipeBook } = useRecipeBookState();

    const insets = useSafeAreaInsets();

    /** Handles the action of pressing the heart */
    function handleHeart() {
        recipe.favorited = !recipe.favorited;
        setRecipeBook(recipeBook);
    }
    /** Handles the action of sharing the recipe */
    function handleShare() {
        console.log("Not yet implemented");
    }
    /** Handles the action of saving the recipe */
    function handleSave() {
        // Create a clone of the recipe so we can safely change the readability
        const clone = recipe.clone();
        clone.readonly = false;

        // Try to add the clone to the recipe book
        const addRecipeResult = recipeBook.addRecipe(clone);
        if (addRecipeResult.success) {
            // Save and update the state
            setRecipeBook(recipeBook);
            
            // Navigate to the new recipe
            navigation.navigate("Recipe", { recipe: clone });
            setSnackBar({ visible: true, message: "Recipe Saved." })

        } 
        else {
            setSnackBar({ visible: true, message: addRecipeResult.message})
        }

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
        <Appbar.Header elevated statusBarHeight={insets.top - 10}>
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
                        <Appbar.Action icon={recipe.favorited ? "heart" : "heart-outline"} onPress={handleHeart} />
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