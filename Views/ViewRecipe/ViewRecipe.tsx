import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Snackbar, Surface, Text, useTheme } from "react-native-paper";
import { createGlobalStyles } from "../styles/globalStyles";
import { Header } from "./Components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { Times } from "./Components/Times";
import { Description } from "./Components/Description";
import { Tags } from "./Components/Tags";
import { Ingredients } from "./Components/Ingredients";
import { Instructions } from "./Components/Instructions";
import { useWindowDimensions } from "react-native";
import { useRecipeBookState } from "../../state";

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

    const { recipeBook } = useRecipeBookState();

    let recipe = route.params.recipe;
    if (route.params.recipe.id in recipeBook.recipes) {
        recipe = recipeBook.recipes[recipe.id];
    }

    const [snackBar, setSnackBar] = useState( {
        visible: false,
        message: ""
    });

    return (
        <View style={globalStyles.container}>

            <Header navigation={navigation} recipe={recipe} setSnackBar={setSnackBar} />

            <ScrollView>
                <View style={styles.imageTitleContainer}>
                    <Image style={styles.image} />

                    <View style={styles.titleTimesDescContainer}>
                        <Text variant="headlineSmall" style={styles.title} >{recipe.name}</Text>

                        <Times prepTime={recipe.prepTime} cookTime={recipe.cookTime} />

                        <Description description={recipe.description} />
                    </View>
                </View>

                <View style={styles.instructionIngredientContainer}>

                    <View style={styles.ingredientContainer}>
                        <Surface style={styles.surface}>
                            <Text variant="titleLarge" style={styles.title} >Ingredients</Text>
                                {
                                    recipe.ingredients.map((ingredient, index) => {
                                        return (
                                            <Ingredients ingredient={ingredient} index={index} key={index}/>
                                        )
                                    })
                                }
                        </Surface>
                    </View>

                    <View style={styles.instructionContainer}>
                        <Surface style={styles.surface}>
                            <Text variant="titleLarge" style={styles.title} >Instructions</Text>
                                {
                                    recipe.instructions.map((instruction, index) => {
                                        return (
                                            <Instructions instruction={instruction} index={index} key={index} ingredients={recipe.ingredients}/>
                                        )
                                    })
                                }
                        </Surface>
                    </View>

                </View>

                <Tags tags={recipe.tags}/>

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

    const screenWidth = useWindowDimensions().width;
    const screenIsBig = screenWidth > 700;

    return StyleSheet.create({
        title: {
            padding: 10, paddingRight: 25
        },
        image: {
            width: screenIsBig ? 400 : "100%", 
            height: screenIsBig ? 300 : 150,
            margin: screenIsBig ? 10 : undefined,
            borderWidth: 1, borderColor: "blue"
        },
        list: {
            padding: 10, paddingHorizontal: 15,
        },

        instructionContainer: {
            flex: screenIsBig ? 7 : undefined
        },
        ingredientContainer: {
            flex: screenIsBig ? 3 : undefined
        },
        instructionIngredientContainer: {
            flexDirection: screenIsBig ? "row" : undefined
        },
        surface: {
            margin: 5, marginVertical: 10,   
            borderRadius: 10, // TODO: Small bug, when the surface is lighter it won't round corners on the bottom      
        },

        imageTitleContainer: {
            flexDirection: screenIsBig ? "row" : undefined
        },
        titleTimesDescContainer: {
            flex: 1,
            marginTop: screenIsBig ? 20 : undefined
        }
    });
}
