import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Post } from "../../Models/Post";
import { PostCard } from "./Components/PostCard";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { Recipe } from "../../Models/Recipe";
import { Comment } from "../../Models/Post";



/**
 * The creates a page where the user can view recipe posts from their friends
 * @param param0 The navigation used to navigate between screens
 */
export default function Social({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const screenWidth = useWindowDimensions().width;

    const [friendPosts, setFriendPosts] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);


    async function getComments(data: any, postRef: Post) {
        
        if (data) {
            const db = getDatabase();
            const array = Object.keys(data).sort((a, b) => data[a].date - data[b].date);
            const comments: Comment[] = [];
    
            for (let i = 0; i < array.length; i++) {
                const key = array[i];
                const value = data[key];
                const newComment: Comment = {
                    author: {
                        authorId: "",
                        authorName: "",
                        authorPic: undefined
                    },
                    commentId: key,
                    value: value.value,
                    date: value.date
                };
    
                await get(ref(db, "users-publicInfo/" + value.authorId)).then(snapshot => {
                    newComment.author = {
                        authorId: value.authorId,
                        authorName: snapshot.val().displayName,
                        authorPic: snapshot.val().profilePicture
                    }
                    comments.push(newComment);
                })
    
                if (i == array.length - 1) {
                    postRef.comments = comments;
                }
            }
        }

    }
    function getPosts() {
        
        const db = getDatabase();
        onValue(ref(db, "users-social/posts"), async snapShot => {
            if (snapShot.exists() && snapShot.val()) {
                const keys = Object.keys(snapShot.val()).sort((a, b) => snapShot.val()[b].created - snapShot.val()[a].created);

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const post = snapShot.val()[key];
                    
                    await get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                        if (data.exists() && data.val()) {

                            let linkedRecipe: Recipe | undefined = undefined;
                            if (post.linkedRecipe) {
                                linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                            }

                            const newPost = new Post(key, data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                            getComments(post.comments, newPost);
                            posts[i] = newPost;
                            setPosts([...posts]);
                        }
                    })
                }

            }
        })
    }

    useEffect(getPosts, []);

    return (
        <View style={globalStyles.container}>
            <Header navigation={route.navigation} />
            

            <Animated.FlatList
                data={posts}
                keyExtractor={(item, index) => item === undefined ? index.toString() : item.id}
                renderItem={({ item }) => {
                    return <Animated.View entering={FadeIn} style={{ flex: 1 / Math.floor(screenWidth / 300) }}>
                        <PostCard post={item} navigation={route.navigation} />
                    </Animated.View>
                }}
                //@ts-ignore
                itemLayoutAnimation={screenWidth >= 600 ? undefined : Layout}
                numColumns={Math.floor(screenWidth / 300)}
                key={Math.floor(screenWidth / 300)}
                ListHeaderComponent={<View>
                    <Text style={{ paddingLeft: 10 }} variant="headlineLarge">Social</Text>
                </View>}
            />
        </View>
    );
}