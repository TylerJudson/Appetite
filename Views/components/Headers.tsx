import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Appbar, Divider, Menu, Tooltip } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";
import { RootStackParamList } from "../navigation";



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
        console.log("Not yet implemented");
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

                    {/** The more button opens a menu with more options. */}
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