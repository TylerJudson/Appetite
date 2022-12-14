import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { createGlobalStyles } from "./styles/globalStyles";
import { ViewRecipeHeader as Header } from "./components/Headers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";
import { ViewRecipeTimes as Times } from "./components/ViewRecipeTimes";
import { ViewRecipeDescription as Description } from "./components/ViewRecipeDescription";
import { ViewRecipeTags as Tags } from "./components/ViewRecipeTags";

type navProps = NativeStackScreenProps<RootStackParamList, 'Recipe'>;
/**
 * Shows a recipe to the user.
 * @param param0 The navigation and parameters (recipe) to navigate between screens and view the recipe
 */
export default function ViewRecipe({ navigation, route }: navProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();
    const styles = createStyles();

    return (
        <View style={globalStyles.container}>

            <Header navigation={navigation} recipe={route.params.recipe}/>

            <ScrollView>

                <Image style={styles.image} source={{ uri: route.params.recipe.image }} />

                <Text variant="titleLarge" style={styles.title} >{route.params.recipe.name}</Text>

                <Times prepTime={route.params.recipe.prepTime} cookTime={route.params.recipe.cookTime} />

                <Description description={route.params.recipe.description}/>

                <Text variant="titleLarge" style={styles.title} >Ingredients</Text>

                    {
                        route.params.recipe.ingredients.map((ingredient, index) => {
                            return (
                                <Text key={index} style={[styles.list, { backgroundColor: index % 2 ? colors.backdrop : undefined}]}>
                                    {ingredient}
                                </Text>
                            )
                        })
                    }

                <Text variant="titleLarge" style={styles.title} >Instructions</Text>
                    {
                        route.params.recipe.instructions.map((instruction, index) => {
                            return (
                                <Text key={index} style={[styles.list, { backgroundColor: index % 2 ? colors.backdrop : undefined}]}>
                                    {index + 1}. {instruction}
                                </Text>
                            )
                        })
                    }

                <Tags tags={route.params.recipe.tags}/>

            </ScrollView>
        </View>
    );
}



/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        title: {
            padding: 10, paddingRight: 25
        },
        image: {
            width: "100%", height: 150,
            borderWidth: 1, borderColor: "blue"
        },
        list: {
            padding: 10, paddingHorizontal: 15,
        }
    });
}
