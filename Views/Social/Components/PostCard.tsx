import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { Avatar, Button, Surface, Text, IconButton } from "react-native-paper";
import { Post } from "../../../Models/Post";
import { Recipe } from "../../../Models/Recipe";
import { Widget } from "../../Discover/Components/Widget";
import { RootStackParamList } from "../../navigation";




export function PostCard({ post, navigation }: { post: Post, navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined> }) {
    const styles = createStyles();

    if (!post) {
        return <></>
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("PostScreen", { post: post })}>
            <Surface style={styles.contentContainer} elevation={3} >

                <View style={styles.authorContainer} >
                    <Avatar.Image size={25} source={post?.authorPic ? { uri: post.authorPic ? post.authorPic : "" } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                    <Text style={styles.authorName} variant="labelLarge">{post.authorName}</Text>
                </View>

                <View style={styles.imageContainer} >
                    <Image style={styles.image} source={{uri: post.image}} />
                    
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                        style={styles.gradient}
                    />

                    <View style={styles.likeCommentContainer} >
                        <View style={[styles.button, styles.likeButton]}>
                            <MaterialCommunityIcons name="heart" size={24} color="#f65" />
                            <Text style={styles.buttonTitle} >{post.favorited.length}</Text>
                        </View>
                        <View style={[styles.button, styles.commentButton]}>
                            <MaterialCommunityIcons name="chat" size={24} color="#65f" />
                            <Text style={styles.buttonTitle} >{post.comments.length}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoContainer} >
                    <Text style={styles.title} variant="headlineSmall" numberOfLines={1} >{post.title}</Text>
                    <Text style={styles.description} numberOfLines={3} >{post.description}</Text>
                </View>

                {
                    post.linkedRecipe &&
                    <View style={styles.linkedRecipe} >
                        <Widget title={post.linkedRecipe.name} image={post.linkedRecipe.image} onPress={() => navigation.navigate("Recipe", { recipe: post.linkedRecipe || Recipe.ReadonlyInital() })} />
                    </View>
                }
            </Surface>
        </TouchableOpacity>
    )
}

/**
 * Creates the styles for the post card
 */
function createStyles() {
    return StyleSheet.create({
        container: {
            margin: 10,
            flex: 1,
        },
        contentContainer: {
            borderRadius: 20,
            padding: 15,
            flex: 1,
        },
        authorContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10
        },
        authorName: {
            paddingLeft: 10
        },
        imageContainer: {
            height: 200,
            width: "100%",
        },
        image: {
            flex: 1,
            borderRadius: 10
        },
        likeCommentContainer: {
            position: "absolute", bottom: 5, left: 5,
            flexDirection: "row"
        },
        button: {
            flexDirection: "row", alignItems: "center",
            paddingHorizontal: 10, paddingVertical: 5,
            borderRadius: 20,
            margin: 5,
        },
        likeButton: {
            backgroundColor: "rgba(255, 102, 119, 0.4)",
        },
        commentButton: {
            backgroundColor: "rgba(120, 102, 255, 0.5)",
        },
        buttonTitle: {
            marginLeft: 10,
            color: "#fff",
            fontSize: 14,
            fontWeight: '600'
        },
        infoContainer: {
            margin: 5, marginTop: 10
        },
        title: {},
        description: {},
        linkedRecipe: {
            width: '105%', alignSelf: "center", marginTop: 15
        },
        gradient: {
            position: 'absolute',
            width: '100%', height: "50%",
            bottom: 0,
            borderBottomRightRadius: 10, borderBottomLeftRadius: 10,
        }
    })
}