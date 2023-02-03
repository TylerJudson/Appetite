import { useState } from "react";
import { FlatList, View, ViewProps, StyleSheet } from "react-native";
import { Recipe } from "../../../Models/Recipe";
import { RecipeCard } from "./RecipeCard";
import { Surface, Text, useTheme } from "react-native-paper";







interface props extends ViewProps {
    header: string
    source: string
    recipeCount: number
}

export function RecipeList({ header, source, recipeCount, ...props }: props) {
    const [recipes, setRecipes] = useState<Recipe[]>(Array(recipeCount).fill(Recipe.Initial()));

    const styles = createStyles();

    function onPress() {
        
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
                    renderItem={({item}) => <RecipeCard title={item.name} description={item.description || ""} image={item.image} onPress={onPress} onAdd={onAdd} />}
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
            marginLeft: 20, fontWeight: "500"
        },
        list: {
            padding: 5
        }
    })
}