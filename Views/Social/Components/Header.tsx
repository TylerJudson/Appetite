import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Appbar, Tooltip, Button, Text, Badge } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal } from "../../components/Modal";
import { RootStackParamList } from "../../navigation";




type navProps = NativeStackNavigationProp<RootStackParamList, 'Appetite'>;


/**
 * Creates a header with a simple back button and an optional title and button
 * @param navigation the global navigation object that allows the header to navigate
 * @param title the optional title to display in the center
 * @param button the option button to show in the right
 * @param leftButton the button to show on the left omit label to see the back chevron
 */
export function Header({ title, navigation }: { title?: string, navigation: navProps }) {
    const insets = useSafeAreaInsets();

    const [inboxModalVisible, setInboxModalVisible] = useState(false);

    return (
        <Appbar.Header statusBarHeight={insets.top - 20} >
            <TouchableOpacity onPress={() => setInboxModalVisible(true)} >
                <Appbar.Action icon="email-outline"  />
                <Badge style={{position: "absolute", top: 10, right: 10}} size={15} >2</Badge>
            </TouchableOpacity>

            <Appbar.Content title={title} />

            <Tooltip title="Profile">
                <Appbar.Action icon="account" onPress={() => navigation.navigate("PublicProfile")} />
            </Tooltip>
            <Tooltip title="Friends">
                <Appbar.Action icon="account-group" onPress={() => navigation.navigate("Friends")} />
            </Tooltip>
            <Tooltip title="New Post">
                <Appbar.Action icon="plus" onPress={() => {}} />
            </Tooltip>




            <Modal visible={inboxModalVisible} setVisible={setInboxModalVisible} headerTitle="Inbox" headerButton="Done">

            </Modal>


        </Appbar.Header>
    )
}