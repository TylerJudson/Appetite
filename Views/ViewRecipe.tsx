import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Snackbar, Text, useTheme } from "react-native-paper";
import { createGlobalStyles } from "./styles/globalStyles";
import { ViewRecipeHeader as Header } from "./components/Headers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";
import { ViewRecipeTimes as Times } from "./components/ViewRecipeTimes";
import { ViewRecipeDescription as Description } from "./components/ViewRecipeDescription";
import { ViewRecipeTags as Tags } from "./components/ViewRecipeTags";
import { ViewRecipeIngredients } from "./components/ViewRecipeIngredients";

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

    const [snackBar, setSnackBar] = useState( {
        visible: false,
        message: ""
    });

    return (
        <View style={globalStyles.container}>

            <Header navigation={navigation} recipe={route.params.recipe} setSnackBar={setSnackBar} />

            <ScrollView>

                <Image style={styles.image} />

                <Text variant="titleLarge" style={styles.title} >{route.params.recipe.name}</Text>

                <Times prepTime={route.params.recipe.prepTime} cookTime={route.params.recipe.cookTime} />

                <Description description={route.params.recipe.description}/>

                <View style={styles.ingredientContainer}>
                <Text variant="titleLarge" style={styles.title} >Ingredients</Text>
                    {
                        route.params.recipe.ingredients.map((ingredient, index) => {
                            return (
                                <ViewRecipeIngredients ingredient={ingredient} index={index} key={index}/>
                            )
                        })
                    }
                </View>

                <View style={styles.instructionContainer}>
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
                </View>

                <Tags tags={route.params.recipe.tags}/>

            </ScrollView>

            <Snackbar 
                visible={snackBar.visible} 
                onDismiss={() => { setSnackBar({...snackBar, visible: false})}}
                duration={3000}
            >
                {snackBar.message}
            </Snackbar>

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
        },
        instructionContainer: {
            paddingVertical: 10,
        },
        ingredientContainer: {
            paddingVertical: 10,
        }
    });
}
