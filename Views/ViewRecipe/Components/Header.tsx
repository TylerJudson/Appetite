import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { getDatabase, ref, remove, update } from "firebase/database";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Appbar, Tooltip, Menu, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateRecipe } from "../../../FireBase/Update";
import { Recipe } from "../../../Models/Recipe";
import { useRecipeBookState, useUserState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";
import { RootStackParamList } from "../../navigation";
import { ShareRecipe } from "./ShareRecipe";

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
export function Header({ navigation, recipe, setSnackBar }: ViewRecipeHeader) {
    /** Whether the menu is visible or not. */
    const [menuVisible, setMenuVisible] = useState(false);
    const { recipeBook, setRecipeBook } = useRecipeBookState();
    const user = useUserState();
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareMenuVisible, setShareMenuVisible] = useState(false);

    const [focus, setFocus] = useState(false);

    const screenWidth = useWindowDimensions().width;
    const insets = useSafeAreaInsets();

    
    //#region BEHAVIOR

    /** Handles the action of pressing the heart */
    function handleHeart() {
        recipe.favorited = !recipe.favorited;
        setRecipeBook(recipeBook);
        if (user) {
            const db = getDatabase();
            let updates: any = {};
            updates['/users/' + user.uid + "/recipes/" + recipe.id + "/favorited"] = recipe.favorited;
            update(ref(db), updates);
        }
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
            
            updateRecipe(user, clone, true);

            // Navigate to the new recipe
            navigation.navigate("Recipe", { recipe: clone });
            setSnackBar({ visible: true, message: "Recipe Saved" })

        }
        else {
            setSnackBar({ visible: true, message: addRecipeResult.message })
        }

    }
    /** Handles the action of editting the recipe */
    function handleEdit() {
        toggleMenu();
        navigation.navigate("EditCreate", { recipe: recipe })
    }
    /** Handles the action of clicking the focus button */
    function handleFocus() {
        if (focus) {
            deactivateKeepAwake();
            setFocus(false);
        }
        else {
            activateKeepAwake();
            setFocus(true);
            setSnackBar({
                visible: true,
                message: "Focus on. Your screen will not turn off."
            })
        }
    }
    /** Handles the action of deleteing the recipe */
    function handleDelete() {
        const delteRecipeResult = recipeBook.deleteRecipe(recipe);
        if (delteRecipeResult.success) {
            // Save and update the state
            setRecipeBook(recipeBook);
            
            
            if (user) {
                const db = getDatabase();
                remove(ref(db, '/users/' + user.uid + "/recipes/" + recipe.id));
                remove(ref(db, "/users/" + user.uid + "/recipeImages/" + recipe.id));
            }

            // Go back to the Home page.
            navigation.navigate("Appetite", {
                snackBar: {
                    visible: true,
                    message: recipe.name + " Deleted",
                    action: {
                        label: "undo",
                        onPressCode: "undoDelete",
                        recipe: recipe
                    }
                }
            }
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

    //#endregion


    return (
        <Appbar.Header statusBarHeight={insets.top - 10}>
            {/** This is the button that allows the user to go back to the previous screen */}
            <Tooltip title="Back">
                <Appbar.BackAction onPress={navigation.goBack} />
            </Tooltip>

            {/** The title for the header is blank */}
            <Appbar.Content title="" />

            {/** Depending on if the recipe is readonly or not display the header differently*/}
            {recipe.readonly ?
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
                                <Menu.Item leadingIcon="lead-pencil" onPress={handleEdit} title="Edit" />
                                <Menu.Item leadingIcon={ focus ? "white-balance-sunny" : "weather-sunny"} onPress={handleFocus} title="Focus" titleStyle={{ fontWeight: focus ? '800' : undefined }} />

                                <Menu anchor={<Menu.Item leadingIcon="share" onPress={handleShare} title="Share" />} visible={shareMenuVisible} onDismiss={() => setShareMenuVisible(false)} anchorPosition="bottom">
                                    <ShareRecipe recipe={recipe} hideModal={() => setShareMenuVisible(false)} navigation={navigation} />
                                </Menu>

                                <Divider />
                                <Menu.Item leadingIcon="trash-can-outline" onPress={handleDelete} title="Delete" />
                            </Menu>
                        </View>
                    </Tooltip>
                </>
            }

            <BottomModal visible={shareModalVisible} setVisible={setShareModalVisible}>
                <ShareRecipe recipe={recipe} hideModal={() => setShareModalVisible(false)}  navigation={navigation}/>
            </BottomModal>
        </Appbar.Header>
    );
}

