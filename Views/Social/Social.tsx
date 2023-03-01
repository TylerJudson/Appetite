import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Post } from "../../Models/Post";
import { PostCard } from "./Components/PostCard";
import { get, getDatabase, limitToFirst, limitToLast, onChildAdded, onChildChanged, onValue, orderByChild, query, ref, startAfter, startAt } from "firebase/database";
import { Recipe } from "../../Models/Recipe";
import { Comment } from "../../Models/Post";
import { useUserState } from "../../state";
import { FriendPostCard } from "./Components/FriendPostCard";



/**
 * The creates a page where the user can view recipe posts from their friends
 * @param param0 The navigation used to navigate between screens
 */
export default function Social({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const user = useUserState();
    const screenWidth = useWindowDimensions().width;

    const [friendPosts, setFriendPosts] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const [refreshing, setRefreshing] = useState(false);


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
                    setPosts([...posts]);
                    setFriendPosts([...friendPosts]);
                }
            }
        }

    }
    function getPosts() {
        if (user) {
            const db = getDatabase();
            let q = query(ref(db, "users-social/posts"), orderByChild("created"), limitToFirst(10), startAfter(posts[posts.length - 1]?.timeStamp || null));
            get(q).then(snapShot => {
                if (snapShot.exists() && snapShot.val()) {
                    snapShot.forEach(child => {
                        const post = child.val();
                        if (post.author !== user.uid) {
                            get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                                if (data.exists() && data.val()) {
                                    let linkedRecipe: Recipe | undefined = undefined;
                                    if (post.linkedRecipe) {
                                        linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                                    }

                                    if (posts.find(p => p.id === child.key) === undefined) {
                                        const newPost = new Post(child.key || "", data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                                        getComments(post.comments, newPost);
                                        posts.push(newPost);
                                        setPosts([...posts.sort((a, b) => a.timeStamp - b.timeStamp)]);
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    function getFriendPosts() {
        if (user) {
            const db = getDatabase();
            let q = query(ref(db, "users-social/users/" + user.uid + "/friendFeed/"), orderByChild("created"), limitToFirst(5), startAfter(friendPosts[friendPosts.length - 1]?.timeStamp || null));
            get(q).then(snapShot => {
                if (snapShot.exists() && snapShot.val()) {
    
                    snapShot.forEach(child => {
                        const post = child.val();
    
                        if (post.author !== user.uid) {
                            get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                                if (data.exists() && data.val()) {
                                    let linkedRecipe: Recipe | undefined = undefined;
                                    if (post.linkedRecipe) {
                                        linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                                    }
    
                                    if (friendPosts.find(p => p.id === child.key) === undefined) {
                                        const newPost = new Post(child.key || "", data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                                        getComments(post.comments, newPost);
                                        friendPosts.push(newPost);
                                        setFriendPosts([...friendPosts.sort((a, b) => a.timeStamp - b.timeStamp)]);
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    useEffect(() => {
        if (user) {

            getFriendPosts();
            getPosts();

            const db = getDatabase();
            onChildChanged(ref(db, "users-social/posts"), snapShot => {
                if (snapShot.exists() && snapShot.val()) {
                    const post = snapShot.val();
                    get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                        if (data.exists() && data.val()) {
                            let linkedRecipe: Recipe | undefined = undefined;
                            if (post.linkedRecipe) {
                                linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                            }

                            const newPost = new Post(snapShot.key || "", data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                            getComments(post.comments, newPost);
                            posts[posts.findIndex(post => post.id === snapShot.key)] = newPost;
                            setPosts([...posts])
                        }
                    })
                }
            });

            onChildChanged(ref(db, "users-social/users/" + user.uid + "/friendFeed/"), snapShot => {
                if (snapShot.exists() && snapShot.val()) {
                    const post = snapShot.val();
                    get(ref(db, "users-publicInfo/" + post.author)).then(data => {
                        if (data.exists() && data.val()) {
                            let linkedRecipe: Recipe | undefined = undefined;
                            if (post.linkedRecipe) {
                                linkedRecipe = new Recipe(post.linkedRecipe.name, post.linkedRecipe.ingredients, post.linkedRecipe.instructions, post.linkedRecipe.description, post.linkedRecipe.image, post.linkedRecipe.id, post.linkedRecipe.prepTime, post.linkedRecipe.cookTime, false, post.linkedRecipe.tags, true);
                            }

                            const newPost = new Post(snapShot.key || "", data.val().displayName, post.author, data.val().profilePicture || undefined, post.favorited ? Object.keys(post.favorited) : [], post.image, post.title, post.description, linkedRecipe, [], post.created);
                            getComments(post.comments, newPost);
                            friendPosts[friendPosts.findIndex(post => post.id === snapShot.key)] = newPost;
                            setFriendPosts([...friendPosts])
                        }
                    })
                }
            });
            

        }
    }, []);

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
                    <Animated.FlatList
                        data={friendPosts}
                        horizontal
                        keyExtractor={(item, index) => item === undefined ? index.toString() : item.id}
                        renderItem={({ item }) => {
                            return <Animated.View entering={FadeIn} style={{ flex: 1 / Math.floor(screenWidth / 300) }}>
                                <FriendPostCard post={item} navigation={route.navigation} />
                            </Animated.View>
                        }}
                        //@ts-ignore
                        itemLayoutAnimation={screenWidth >= 600 ? undefined : Layout}
                        onEndReached={getFriendPosts}
                        onEndReachedThreshold={0.5}
                    />
                </View>}
                onEndReached={getPosts}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    friendPosts.splice(0, friendPosts.length);
                    getFriendPosts();
                    posts.splice(0, posts.length);
                    getPosts();
                    setTimeout(() => setRefreshing(false), 500);
                }}
            />
        </View>
    );
}``