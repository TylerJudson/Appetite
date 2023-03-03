import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View, Image, useWindowDimensions, Platform } from "react-native";
import { Avatar, Button, Surface, Text, IconButton } from "react-native-paper";
import { Post } from "../../../Models/Post";
import { Recipe } from "../../../Models/Recipe";
import { Widget } from "../../Discover/Components/Widget";
import { RootStackParamList } from "../../navigation";




export function FriendPostCard({ post, navigation }: { post: Post, navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined> }) {
    const styles = createStyles();

    if (!post) {
        return <></>
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("PostScreen", { post: post, id: post.id })}>
            <Surface style={styles.contentContainer} elevation={3} >

                <Image style={styles.image} source={{ uri: post.image }} />

                <LinearGradient
                    // Background Linear Gradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                    style={styles.gradient}
                />

                <View style={styles.detailContainer}>

                    {
                        post.linkedRecipe &&
                        <View style={styles.linkedRecipe} >
                            <Widget title={post.linkedRecipe.name} image={post.linkedRecipe.image} onPress={() => navigation.navigate("Recipe", { recipe: post.linkedRecipe || Recipe.ReadonlyInital() })} />
                        </View>
                    }
                    <Avatar.Image size={40} source={post?.authorPic ? { uri: post.authorPic ? post.authorPic : "" } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                    <Text style={styles.title} variant="titleMedium" numberOfLines={1} >{post.title}</Text>

                </View>

            </Surface>
        </TouchableOpacity>
    )
}

/**
 * Creates the styles for the post card
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;

    return StyleSheet.create({
        container: {
            margin: 10,
            width: screenWidth / 2.5,
            height: screenWidth / 2,
            maxWidth: 200,
            maxHeight: 250,
        },
        contentContainer: {
            borderRadius: 15,
            flex: 1,
        },
        image: {
            flex: 1,
            borderRadius: 15
        },
        detailContainer: {
            position: "absolute",
            justifyContent: "flex-end",
            width: "100%", height: "100%",
            padding: 5, paddingHorizontal: 10,
        },
        title: {
            color: "#fff",
            textShadowColor: "#000", textShadowRadius: 5,
            marginTop: 10,
        },
        linkedRecipe: {
            position: "absolute", top: -20,
            width: Platform.OS === "web" ? "200%" : '220%', transform: [{scale: 0.5}], 
            alignSelf: "center", 
        },
        gradient: {
            position: 'absolute',
            width: '100%', height: "80%",
            bottom: 0,
            borderBottomRightRadius: 10, borderBottomLeftRadius: 10,
        }
    })
}