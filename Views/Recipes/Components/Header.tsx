import { Dispatch, SetStateAction, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Appbar, Tooltip, Menu, SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomModal } from "../../components/BottomModal";
import { Tags } from "./Tags";

/**
 * Displays a header at the top of the screen that showsa filter button, view all recipes and favorites button, and a search button
 * @param viewFavorites whether or not the favorite segment is selected
 * @param setViewFavorites the function to change viewFavorites
 * @param toggleSearch the function to toggle the search bar
 */
export function Header({ viewFavorites, setViewFavorites, toggleSearch, tags, setTags }: { viewFavorites: boolean, setViewFavorites: Dispatch<SetStateAction<boolean>>, toggleSearch: VoidFunction, tags: string[], setTags: Dispatch<SetStateAction<string[]>> }) {
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
        <Appbar.Header statusBarHeight={insets.top - 15}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <Tooltip title="Tags">
                    <Menu anchor={<Appbar.Action icon={"filter-variant"} onPress={handleTags} />} visible={tagsMenuVisible} onDismiss={() => setTagsMenuVisible(false)} anchorPosition="bottom">
                        <Tags title="Filters" clear tags={tags} setTags={setTags} />
                    </Menu>

                </Tooltip>

                <View style={{ alignSelf: "center", flex: 1, marginHorizontal: 10 }}>
                    <SegmentedButtons
                        value={viewFavorites ? "Favorites" : "All Recipes"}
                        onValueChange={(value) => { setViewFavorites(value === "Favorites") }}
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
                <Tags title="Filters" clear tags={tags} setTags={setTags} />
            </BottomModal>


        </Appbar.Header>
    )
}
