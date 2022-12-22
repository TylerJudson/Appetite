import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { Recipe } from "../../Models/Recipe";
import { RecipeBook } from "../../Models/RecipeBook";
import { useRecipeBookState } from "../../state";
import { RootStackParamList, Route } from "../navigation";
import { createGlobalStyles } from "../styles/globalStyles";


const Cupcake = new Recipe("Vanilla Cupcakes",
    ["1 1/4 cups all-purpose flour", "1 1/4 tsp baking powder", "1/2 tsp salt", "1/2 cup unsalted butter, softened", "3/4 cup sugar", "2 large eggs, room temperature", "2 tsp pur vanilla extract", "1/2 cup buttermilk, room temperature"],
    ["Preheat the oven to 350°F and line a cupcake/muffin pan with cupcake liners.", "In a medium bowl, whisk together 1 1/4 cups flour, 1 1/4 tsp baking powder, and 1/2 tsp salt. Set flour mix aside.", "In the bowl of an electric mixer, beat butter and sugar on medium-high speed 5 minutes until thick and fluffy, scraping down the bowl as needed.", "Add eggs one at a time, beating well with each addition then scrape down the bowl. Add 2 tsp vanilla and beat to combine.", "Reduce mixer speed to medium and add the flour mixture in thirds alternating with the buttermilk, mixing to incorporate with each addition. Scrape down the bowl as needed and beat until just combined and smooth. Divide the batter evenly into a 12-count lined muffin or cupcake pan, filling 2/3 full.", "Bake for 20-23 minutes at 350 °F, or until a toothpick inserted in the center comes out clean. Let them cool in the pan for 5 minutes, then transfer to a wire rack and cool to room temperature before frosting."],
    "This is the only vanilla cupcake recipe you need! They are perfectly soft, rise evenly and go well with just about any cupcake frosting. The best cupcakes!",
    8, 22, false, ["Dessert", "Sweet", "Good", "Vanilla", "Cupcake"])

const Pancakes = new Recipe("Old-Fashioned Pancakes",
    ["1 1/2 cups all-purpose flour", "3 1/2 tsp baking powder", "1 tbsp white sugar", "1/4 tsp salt", "1 1/4 cups milk", "3 tablespoons butter, melted", "1 egg"],
    ["Sift flour, baking powder, sugar, and salt together in a large bowl. Make a well in the center and add milk, melted butter, and egg; mix until smooth.", "Heat a lightly oiled griddle or pan over medium-high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake; cook until bubbles form and the edges are dry, about 2 to 3 minutes. Flip and cook until browned on the other side. Repeat with remaining batter."],
    "I found this pancake recipe in my Grandma's recipe book. Judging from the weathered look of this recipe card, this was a family favorite.",
    5, 15, false, ["Breakfast", "Pancakes"])


type navProps = NativeStackScreenProps<RootStackParamList, 'Appetite'>;
/**
 * The creates a page where the user can view recipe posts from their friends
 * @param param0 The navigation used to navigate between screens
 */
export default function Social({ route }: Route) {
    const theme = useTheme();
    const colors = theme.colors;
    const globalStyles = createGlobalStyles();


    const { recipeBook, setRecipeBook } = useRecipeBookState();

    return (
        <View style={globalStyles.screenContainer}>
            <Text variant="headlineLarge" >Social</Text>
            <Button onPress={() => {
                recipeBook.addRecipe(Cupcake);
                recipeBook.addRecipe(Pancakes);
                setRecipeBook(recipeBook);
                recipeBook.saveData();
            }}>Populate Storage with cupcake and pancakes</Button>

            <Button onPress={() => {
                recipeBook.recipes = {}
                setRecipeBook(recipeBook);
                AsyncStorage.removeItem("RecipeBook");
            }}>Clear your Storage</Button>
        </View>
    );
}