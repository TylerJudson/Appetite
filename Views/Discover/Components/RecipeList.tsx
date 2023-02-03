import { useEffect, useState } from "react";
import { FlatList, View, ViewProps, StyleSheet } from "react-native";
import { Recipe } from "../../../Models/Recipe";
import { RecipeCard } from "./RecipeCard";
import { Snackbar, Surface, Text, useTheme } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";
import { getDatabase, get, ref } from "firebase/database";
import { updateRecipe } from "../../../FireBase/Update";
import { useUserState, useRecipeBookState } from "../../../state";







interface props extends ViewProps {
    header: string
    source: string
    recipeCount: number
    setSnackBar: React.Dispatch<React.SetStateAction<{
        visible: boolean;
        message: string;
    }>>
    navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined>
}

export function RecipeList({ header, source, recipeCount, navigation, setSnackBar, ...props }: props) {

    
    const [recipes, setRecipes] = useState<Recipe[]>(Array(recipeCount).fill(Recipe.ReadonlyInital()));

    const user = useUserState();
    const { recipeBook, setRecipeBook } = useRecipeBookState();
  

    const styles = createStyles();

    function onPress(recipe: Recipe) {
        navigation.navigate("Recipe", { recipe: recipe })
    }
    function onAdd(recipe: Recipe) {
        // Create a clone of the recipe so we can safely change the readability
        const clone = recipe.clone();
        clone.readonly = false;

        // Try to add the recipe to the recipe book
        const addRecipeResult = recipeBook.addRecipe(clone);
        if (addRecipeResult.success) {
            // Save and update the state
            setRecipeBook(recipeBook);
            updateRecipe(user, clone, true);

            setSnackBar({ visible: true, message: "Recipe Saved" })
        }
        else {
            setSnackBar({ visible: true, message: addRecipeResult.message })
        }
    }

    useEffect(() => {
        if (source) {
            const db = getDatabase();
            get(ref(db, source)).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    Object.keys(snapshot.val()).map((key: string, index) => {
                            let x = snapshot.val()[key];
                            const rec = new Recipe(x.name, x?.ingredients || [], x?.instructions || [], x.description, x.image, x.id, x.prepTime, x.cookTime, undefined, x?.tags || [], true);
                            recipes[index] = rec;
                        });
                    setRecipes([...recipes]);
                }
            })
        }
    }, [])

    return (
        <View {...props} >
            <View style={styles.container} >
                <Text style={styles.header} variant="titleMedium">{header}</Text>
                <FlatList
                    style={styles.list}
                    contentContainerStyle={{paddingRight: 15}}
                    data={recipes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item}) => <RecipeCard title={item.name} description={item.description || ""} image={item.image} onPress={() => onPress(item)} onAdd={() => onAdd(item)} />}
                />
            </View>

           
        </View>
    )
}




/**
 * Creates a set of styles that should be used for all components (for consistency).
 * @returns the styles
 */
export function createStyles() {
    const theme = useTheme();
    const colors = theme.colors;

    return StyleSheet.create({
        container: {
            flex: 1, paddingTop: 10, paddingBottom: 5,
            borderRadius: 10,
        },
        header: {
            marginLeft: 20, fontWeight: "700"
        },
        list: {
            padding: 5, paddingBottom: 25
        }
    })
}