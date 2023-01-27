import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Image, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation";
import { Avatar, Text } from "react-native-paper"
import { ImageChooser } from "../../EditCreateRecipe/Components/ImageChooser";
import { createGlobalStyles } from "../../styles/globalStyles";
import { Widget } from "../../Discover/Components/Widget";
import { useEffect, useState } from "react";
import { Recipe } from "../../../Models/Recipe";
import { get, getDatabase, ref } from "firebase/database";
import { useUserState } from "../../../state";



type navProps = NativeStackScreenProps<RootStackParamList, 'PostScreen'>;


export function PostScreen({navigation, route}: navProps) {

    const user = useUserState();
    
    const globalStyles = createGlobalStyles();
    const styles = createStyles();


    const [image, setImage] = useState('');
    const [author, setAuthor] = useState('');
    const [authorPic, setAuthorPic] = useState('');

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [linkedRecipe, setLinkedRecipe] = useState<Recipe | undefined>(undefined);

    console.log(linkedRecipe);


    useEffect(() => {
        if (route.params.id && user) {
            const db = getDatabase();

            // If the post is private
            if (true) {
                get(ref(db, "users-social/users/" + user.uid + "/friendFeed/" + route.params.id )).then(snapshot => {
                    if (snapshot.exists() && snapshot.val()) {
                        setImage(snapshot.val().image);
                        setAuthor(snapshot.val().author);
                        setTitle(snapshot.val().title);
                        setDescription(snapshot.val().description);
                        const recipe = snapshot.val().linkedRecipe;
                        if (recipe) {
                            setLinkedRecipe(new Recipe(recipe.name, recipe.ingredients, recipe.instructions, recipe.description, recipe.image, recipe.id, recipe.prepTime, recipe.cookTime, recipe.favorited, recipe.tags, true));
                        }
                    }
                })
            }
        }
    }, [])



    return (
        <View style={[globalStyles.container, styles.container]}>
            <Image style={styles.image} source={{uri: image}} />  

            <View style={styles.authorContainer}>
                <Avatar.Image size={24} source={authorPic ? { uri: authorPic } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                <Text style={styles.author} variant="labelLarge">{author}</Text>         
            </View>

            <Text style={styles.title} variant="headlineMedium">{title}</Text> 

            <Text style={styles.label} variant="labelLarge">DESCRIPTION</Text>
            <Text style={styles.description} variant="bodyLarge">{description}</Text>

            { linkedRecipe && <View style={styles.linkedRecipe}><Widget title={linkedRecipe.name} image={linkedRecipe.image} onPress={() => navigation.navigate("Recipe", { recipe: linkedRecipe })} /></View> }
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

        },
        image: {

        },
        authorContainer: {

        },
        title: {

        },
        author: {

        },
        label: {

        },
        description: {

        },
        linkedRecipe: {

        }
    });
}
