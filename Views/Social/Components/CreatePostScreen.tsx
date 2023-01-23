import React, { useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView, useWindowDimensions, ScrollView } from "react-native";
import { Searchbar, TextInput, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Recipe } from "../../../Models/Recipe";
import { useRecipeBookState, useUserState } from "../../../state";
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { RootStackParamList } from "../../navigation";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Header } from "../../EditCreateRecipe/Components/Header";
import { alert } from "../../../utilities/Alert";
import { Widget } from "../../Discover/Components/Widget";
import { Modal } from "../../components/Modal";
import Animated,{ Layout } from "react-native-reanimated"
import { get, getDatabase, push, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

type navProps = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;


/**
 * Displays a screen that allows the user to create a post
 * @param navigation The navigation 
 */
export default function CreatePostScreen({ navigation }: navProps) {
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    const { recipeBook, setRecipeBook } = useRecipeBookState();
    const user = useUserState();

    const [selectedImage, setSelectedImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [linkedRecipe, setLinkedRecipe] = useState<Recipe | undefined>();

    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    /**
     * Handles the action of creating the post 
     */
    function handleCreate() {
        // if (title === "") return alert("Missing Title", "You need a title before you can create a post.", [{text: "Okay", style: "cancel"}]);
        // if (description === "") return alert("Missing Description", "You need a description before you can create a post.", [{text: "Okay", style: "cancel"}]);
        // if (selectedImage === "") return alert("Missing Image", "You need an image before you can create a post.", [{text: "Okay", style: "cancel"}]);

        AddPostToDatabase();

    }

    /**
     * Displays an alert verifying the user wants to discard the post 
     */
    function handleBack() {
        return alert(
            "Discard Post?",
            "This post will not be saved.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Discard",
                    onPress: () => navigation.goBack(),
                    style: "destructive"
                }
            ],
            navigation.goBack
        )
    }

    function handleSelectRecipe(id: string) {
        setLinkedRecipe(recipeBook.recipes[id].deepClone());
        setModalVisible(false);
    }


    async function AddPostToDatabase() {
        if (user) {
            const db = getDatabase();
            const postId = uuidv4();
            // Add the post to the global list of posts
            // await set(ref(db, "users-social/posts/" + postId), { title: title, description: description, image: selectedImage, linkedRecipe: linkedRecipe, created: Date.now() });
            navigation.goBack();
            navigation.navigate("PostScreen", { id: postId });
            // Add the post to the list of user posts
            // set(ref(db, "users-social/users/" + user.uid + "/posts/" + postId), { title: title, description: description, image: selectedImage, linkedRecipe: linkedRecipe, created: Date.now() });
            // Add the post to all of the users friends
            // get(ref(db, "users-social/users/" + user.uid + "/friends")).then(snapshot => {
            //     if (snapshot.exists() && snapshot.val()) {
            //         Object.keys(snapshot.val()).forEach(friend => {
            //             set(ref(db, "users-social/users/" + friend + "/friendFeed/" + postId), { title: title, description: description, image: selectedImage, linkedRecipe: linkedRecipe, created: Date.now() });
            //         });
            //     }
            // })
        }
    }

    return (
        <View style={globalStyles.container}>

            <Header
                title="Create Post"
                button={{label: "Create", onPress: handleCreate }}
                leftButton={{ label: "Cancel", onPress: handleBack }}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={5}>
                <ScrollView>
                    <ImageChooser selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

                    <TextInput style={styles.oneLineTextInput} label="Title" value={title} onChangeText={setTitle} />
                    <TextInput style={[styles.oneLineTextInput, {marginBottom: 50}]} label="Description" multiline value={description} onChangeText={setDescription} />

                    <Widget title={linkedRecipe ? linkedRecipe.name : "Link a Recipe"} image={linkedRecipe?.image || ""} onPress={() => setModalVisible(true)}  />

                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={modalVisible} setVisible={setModalVisible} headerTitle="Link a Recipe" headerButton="Cancel">
                <Searchbar style={styles.searchBar} placeholder="Search Recipes" onChangeText={setSearch} value={search} />

                <Animated.FlatList 
                    style={{paddingTop: 10}}
                    data={Object.values(recipeBook.recipes).filter(value => value.name.includes(search)).sort((a, b) => a.name.localeCompare(b.name))}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <Widget title={item.name} image={item.image} onPress={() => handleSelectRecipe(item.id)} />}
                    //@ts-ignore
                    itemLayoutAnimation={Layout}
                />
            </Modal>

        </View>
    );
}






/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        oneLineTextInput: {
            marginVertical: 20
        },
        searchBar: {
            marginHorizontal: 10, marginTop: 5,
            height: 40,
        },
    });
}
