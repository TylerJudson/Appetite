import { useState } from "react";
import { FlatList, View, ViewProps, StyleSheet } from "react-native";
import { Recipe } from "../../../Models/Recipe";
import { RecipeCard } from "./RecipeCard";
import { Surface, Text, useTheme } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";







interface props extends ViewProps {
    header: string
    source: string
    recipeCount: number
    navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined>
}

export function RecipeList({ header, source, recipeCount, navigation, ...props }: props) {
    const [recipes, setRecipes] = useState<Recipe[]>(Array(recipeCount).fill(Recipe.ReadonlyInital()));

    const styles = createStyles();

    function onPress(recipe: Recipe) {
        navigation.navigate("Recipe", { recipe: recipe })
    }
    function onAdd() {

    }

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
                    renderItem={({item}) => <RecipeCard title={item.name} description={item.description || ""} image={item.image} onPress={() => onPress(item)} onAdd={onAdd} />}
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