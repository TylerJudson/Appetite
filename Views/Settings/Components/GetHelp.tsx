import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Modal } from "../../components/Modal";






/**
 * Creates a screen that displays the get help section
 * @param modalVisible whether or not the modal is visible or not
 * @param setModalVisible sets the visibility of the modal
 */
export function GetHelp({ modalVisible, setModalVisible }: { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) {


    const styles = createStyles();

    return (

        <Modal visible={modalVisible} setVisible={setModalVisible} headerTitle="Appetite" headerButton="Done">
            <ScrollView style={{ height: "100%" }}>
                <View style={styles.container}>
                    <Text style={styles.title} variant="headlineMedium">Get Help</Text>
                    
                </View>

            </ScrollView>
        </Modal>
    )
}




/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {

    return StyleSheet.create({
        container: {
            alignItems: "center", height: "100%", padding: 15
        },
        title: {
            marginTop: 75, marginBottom: 10,
            fontWeight: "300"
        },
    });
}


