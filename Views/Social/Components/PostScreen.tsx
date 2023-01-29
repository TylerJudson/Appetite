import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { RootStackParamList } from "../../navigation";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper"
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Widget } from "../../Discover/Components/Widget";
import { useEffect, useState } from "react";
import { Recipe } from "../../../Models/Recipe";
import { get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { useUserState } from "../../../state";
import { LinearGradient } from "expo-linear-gradient";



type navProps = NativeStackScreenProps<RootStackParamList, 'PostScreen'>;


export function PostScreen({navigation, route}: navProps) {

    const user = useUserState();
    
    const globalStyles = createGlobalStyles();
    const styles = createStyles();
    const colors = useTheme().colors;

    const [image, setImage] = useState('');
    const [author, setAuthor] = useState({id: "", name: ""});
    const [authorPic, setAuthorPic] = useState('');

    const [favorited, setFavorited] = useState(false);
    const [favoritedCount, setFavoritedCount] = useState(0);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [linkedRecipe, setLinkedRecipe] = useState<Recipe | undefined>(undefined);



    async function favorite() {
        if (user) {
            const db = getDatabase();
            let postRef = "users-social/posts/" + route.params.id;
            let friendFeedRef = "users-social/users/" + user.uid + "/friendFeed/" + route.params.id;
            let userRef = "users-social/users/" + author.id + "/posts/" + route.params.id;
            if (favorited) {
                setFavorited(false);
                setFavoritedCount(favoritedCount - 1);
    
                remove(ref(db, postRef + "/favorited/" + user.uid));
                remove(ref(db, friendFeedRef +  "/favorited/" + user.uid));
                remove(ref(db, userRef + "/favorited/" + user.uid));

                // Send an unlike notification
                set(push(ref(db, "users-social/users/" + author.id + "/inbox/notifications/")), { code: "unlike", id: user.uid, postId: route.params.id, date: Date.now(), title: title, read: false })
            }
            else {
                setFavorited(true);
                setFavoritedCount(favoritedCount + 1);

                const updates: any = {};
                if (await get(ref(db, postRef)).then(snapshot => snapshot.exists())) {
                    updates[postRef + "/favorited/" + user.uid] = true;
                }
                if (await get(ref(db, friendFeedRef)).then(snapshot => snapshot.exists())) {
                    updates[friendFeedRef + "/favorited/" + user.uid] = true;
                }
                if (await get(ref(db, userRef)).then(snapshot => snapshot.exists())) {
                    updates[userRef + "/favorited/" + user.uid] = true;
                }
                update(ref(db), updates);
                // Send a like notification
                set(push(ref(db, "users-social/users/" + author.id + "/inbox/notifications/")), { code: "like", id: user.uid, postId: route.params.id, date: Date.now(), title: title, read: false })
            }
        }
    }
    function onAuthorPress() {
        navigation.goBack();
        setTimeout(() => navigation.navigate("PublicProfile", { id: author.id }))
    }
    function onRecipePress() {
        if (linkedRecipe) {
            navigation.goBack();
            setTimeout(() => navigation.navigate("Recipe", { recipe: linkedRecipe }))
        }
    }

    function displayPost(value: any) {
        const db = getDatabase();

        setImage(value.image);
        setTitle(value.title);
        setDescription(value.description);

        if (user && value.favorited) {
            setFavoritedCount(Object.keys(value.favorited).length || 0)
            setFavorited(user.uid in value.favorited || false);
        }

        const recipe = value.linkedRecipe;
        if (recipe) {
            setLinkedRecipe(new Recipe(recipe.name, recipe.ingredients, recipe.instructions, recipe.description, recipe.image, recipe.id, recipe.prepTime, recipe.cookTime, recipe.favorited, recipe.tags, true));
        }

        get(ref(db, "users-publicInfo/" + value.author)).then(snapshot => {
            if (snapshot.exists() && snapshot.val()) {
                setAuthor({ id: value.author, name: snapshot.val().displayName });
                setAuthorPic(snapshot.val().profilePicture);
            }
        })
    }

    useEffect(() => {
        if (route.params.id && user) {
            const db = getDatabase();
            get(ref(db, "users-social/posts/" + route.params.id )).then(snapShot1 => {
                if (snapShot1.exists() && snapShot1.val()) {
                    displayPost(snapShot1.val())
                }
                else {
                    // Try to get the post from friend feed
                    get(ref(db, "users-social/users/" + user.uid + "/friendFeed/" + route.params.id )).then((snapshot2) => {
                        if (snapshot2.exists() && snapshot2.val()) {
                            displayPost(snapshot2.val())
                        }
                        else {
                            // Try to get the post from the user's posts
                            get(ref(db, "users-social/users/" + user.uid + "/posts/" + route.params.id)).then(snapshot3 => {
                                if (snapshot3.exists() && snapshot3.val()) {
                                    displayPost(snapshot3.val())
                                }
                                else {
                                    navigation.goBack();
                                }
                            })
                        }
                    })
                    
                }
            })
        }
    }, [])



    return (
        <View style={globalStyles.container}>
        <ScrollView style={styles.container}>
            <View style={{marginBottom: 50}}>

            <View>
                <Image style={styles.image} source={{uri: image || undefined}} />  
                <LinearGradient
                    // Background Linear Gradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                    style={styles.gradient}
                />
                <TouchableOpacity style={styles.heartContainer}  onPress={favorite}>
                    <IconButton icon={favorited ? "heart" : "heart-outline"} iconColor={favorited ? "#f67" : "#ddd"} size={30} />
                    {favoritedCount > 0 && <Text style={styles.heartCount} variant="labelSmall">{favoritedCount}</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.headerContainer}>
                <Text style={styles.title} variant="displayMedium">{title}</Text> 

                <TouchableOpacity style={styles.authorContainer} onPress={onAuthorPress}>
                    <Avatar.Image size={25} source={authorPic ? { uri: authorPic } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                    <Text style={styles.author} variant="titleMedium">{author.name}</Text>         
                </TouchableOpacity>
            </View>

            <Text style={styles.description} variant="bodyLarge">{description}</Text>

            { linkedRecipe && <View style={styles.linkedRecipe}><Widget title={linkedRecipe.name} image={linkedRecipe.image} onPress={onRecipePress} /></View> }
            </View>
        </ScrollView>
        </View>
    )
}





/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {

    return StyleSheet.create({
        container: {
            flex: 1, width: '100%',
            maxWidth: 700,
            alignSelf: 'center',
        },
        image: {
            height: 300, width: "100%", alignSelf: "center"
        },
        headerContainer: {
            justifyContent: "space-between", marginHorizontal: 25
        },
        authorContainer: {
            flexDirection: "row", alignItems: "center"
        },
        title: {
            margin: 5, marginTop: 10
        },
        author: {
            margin: 5
        },
        description: {
            marginHorizontal: 25, margin: 15
        },
        linkedRecipe: {

        },
        heartContainer: {
            position: "absolute", right: 0, bottom: -10,
        },
        heartCount: {
            position: "absolute", bottom: 10, right: 12, color: "#ddd", shadowRadius: 1, shadowColor: "#000", shadowOffset: {height: 0, width: 0}, shadowOpacity: 1
        },
        gradient: {
            position: 'absolute',
            width: '100%', height: "50%",
            bottom: 0,
        }
    });
}
