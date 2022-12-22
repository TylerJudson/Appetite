import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Appbar, Divider, Menu, Tooltip, SegmentedButtons, Button, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../Models/Recipe";
import { useRecipeBookState } from "../../state";
import { RootStackParamList } from "../navigation";
import { BottomModal } from "./BottomModal";
import { Tags } from "./Tags";
import { ShareRecipe } from "./ViewRecipeComponents/ShareRecipe";


/**
 * Displays a header at the top of the screen that showsa filter button, view all recipes and favorites button, and a search button
 * @param viewFavorites whether or not the favorite segment is selected
 * @param setViewFavorites the function to change viewFavorites
 * @param toggleSearch the function to toggle the search bar
 */
export function RecipesHeader({ viewFavorites, setViewFavorites, toggleSearch, tags, setTags }: { viewFavorites: boolean, setViewFavorites: Dispatch<SetStateAction<boolean>>, toggleSearch: VoidFunction, tags: string[], setTags: Dispatch<SetStateAction<string[]>> }) {
    const insets = useSafeAreaInsets();

    const screenWidth = useWindowDimensions().width;
    const [tagsModalVisible, setTagsModalVisible] = useState(false);
    const [tagsMenuVisible, setTagsMenuVisible] = useState(false);

    /**
      Handles the action of pressing the tags button
     */
    function handleTags() {
        // If the screen is large show the menu
        if (screenWidth > 700) {
            setTagsMenuVisible(true);
        } 
        // Else show the modal
        else {
            setTagsModalVisible(true);
        }
    }


    return (
        <Appbar.Header elevated statusBarHeight={insets.top - 15}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <Tooltip title="Tags">
                    <Menu anchor={<Appbar.Action icon={"filter-variant"} onPress={handleTags} />} visible={tagsMenuVisible} onDismiss={() => setTagsMenuVisible(false)} anchorPosition="bottom">
                        <Tags tags={tags} setTags={setTags} />
                    </Menu>
                    
                </Tooltip>

                <View style={{alignSelf: "center"}}>
                    <SegmentedButtons 
                        value={viewFavorites ? "Favorites" : "All Recipes"}
                        onValueChange={(value) => {setViewFavorites(value === "Favorites")}}
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
                    <Appbar.Action icon={"magnify"} onPress={toggleSearch} />
                </Tooltip>
            </View>

            <BottomModal visible={tagsModalVisible} setVisible={setTagsModalVisible}>
                <Tags tags={tags} setTags={setTags} />
            </BottomModal>


        </Appbar.Header>
    )
}



type navProps = NativeStackNavigationProp<RootStackParamList, 'Recipe'>;
interface ViewRecipeHeader {
    /** The navigation for the screen */
    navigation: navProps;
    /** The recipe (so the user can save or send it.) */
    recipe: Recipe;
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
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareMenuVisible, setShareMenuVisible] = useState(false);

    const screenWidth = useWindowDimensions().width;
    const insets = useSafeAreaInsets();

    /** Handles the action of pressing the heart */
    function handleHeart() {
        recipe.favorited = !recipe.favorited;
        setRecipeBook(recipeBook);
    }
    /** Handles the action of sharing the recipe */
    function handleShare() {
        if (screenWidth > 700) {
            setShareMenuVisible(true);
        }
        else {
            toggleMenu();
            setShareModalVisible(true);
        }
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
            setSnackBar({ visible: true, message: "Recipe Saved" })

        } 
        else {
            setSnackBar({ visible: true, message: addRecipeResult.message})
        }

    }
    /** Handles the action of editting the recipe */
    function handleEdit() {
        toggleMenu();
        navigation.navigate("EditCreate", { recipe: recipe })
    }
    /** Handles the action of adding and viewing tags */
    function handleTags() {
        console.log("Not yet implemented");
    }
    /** Handles the action of deleteing the recipe */
    function handleDelete() {
        const delteRecipeResult = recipeBook.deleteRecipe(recipe);
        if (delteRecipeResult.success) {
            // Save and update the state
            setRecipeBook(recipeBook);

            // Go back to the Home page.
            navigation.navigate( "Appetite", { snackBar: {
                visible: true,
                message: recipe.name + " Deleted",
                action: {
                    label: "undo",
                    onPressCode: "undoDelete",
                    recipe: recipe
                }
            }}
            );
        }
        else {
            setSnackBar({ visible: true, message: delteRecipeResult.message })
        }
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

                    {/** The more button opens a menu with more options. */}
                    <Tooltip title="More">
                        <View>
                        <Menu
                            visible={menuVisible}
                            onDismiss={toggleMenu}
                            anchor={<Appbar.Action icon="dots-vertical" onPress={toggleMenu} />}
                            anchorPosition="bottom"
                        >
                            <Menu.Item leadingIcon="lead-pencil"  onPress={handleEdit}  title="Edit" />
                            <Menu.Item leadingIcon="tag-multiple" onPress={handleTags}  title="Tags" />

                            <Menu anchor={<Menu.Item leadingIcon="share" onPress={handleShare} title="Share" />} visible={shareMenuVisible} onDismiss={() => setShareMenuVisible(false)} anchorPosition="bottom">
                                <ShareRecipe recipe={recipe} />
                            </Menu>
                            
                            <Divider />
                            <Menu.Item leadingIcon="trash-can-outline" onPress={handleDelete} title="Delete" />
                        </Menu>
                        </View>
                    </Tooltip>
                </>
            }

            <BottomModal visible={shareModalVisible} setVisible={setShareModalVisible}>
                <ShareRecipe recipe={recipe} />
            </BottomModal>
        </Appbar.Header>
    );
}




type anyNavProps = NativeStackNavigationProp<RootStackParamList, any>;


/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function BackHeader({ navigation, title, button, leftButton }: { navigation: anyNavProps, title?: string, button?: { label: string, onPress: VoidFunction }, leftButton: { label?: string, onPress: VoidFunction }}) {
    const insets = useSafeAreaInsets();

    return (
    <Appbar.Header statusBarHeight={insets.top - 35}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", top: 10 }}>

        {
            leftButton.label
            ? <Button onPress={leftButton.onPress}>{leftButton.label}</Button>
            
            :   <Tooltip title="Back">
                    <Appbar.BackAction onPress={leftButton.onPress} style={{top: 3}}/>
                </Tooltip>
        }       
        {
            title &&
            <Text variant="titleMedium" style={{bottom: 8}}>{title}</Text>
        }

        {
            button &&
            <Button onPress={button.onPress}>{button.label}</Button>

        }
        </View>
    </Appbar.Header>
    )
}