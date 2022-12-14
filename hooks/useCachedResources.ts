import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Recipe } from '../Models/Recipe';
import { State } from '../state';


const Pizza = new Recipe("Air-Fryer Sausage Pizza",
  ["1 loaf frozen bread dough, thawed", "1 cup pizza sauce", "1/2 pound bulk Italian sausage, cooked and drained", "1-1/3 cups shredded part-skim mozzarella cheese", "1 small green pepper, sliced into rings", "1 tsp dried oregano", "Crushed red pepper flakes, optional"],
  ["On a lightly floured surface, roll and stretch dough into four 4-in. circles. Cover; let rest for 10 minutes.", "Preheat air fryer to 400°. Roll and stretch each dough into a 6-in. circle. Place 1 crust on greased tray in air-fryer basket. Carefully spread with 1/4 cup pizza sauce, 1/3 cup sausage, 1/3 cup cheese, a fourth of the green pepper rings and a pinch of oregano. Cook until crust is golden brown, 6-8 minutes. If desired, sprinkle with red pepper flakes. Repeat with remaining ingredients."],
  "This pizza is really good and easy to make int he air fryer. I hope you enjoy.",
  30, 10, ["Pizza", "Supper", "Air-Fryer"], true)

const Cupcake = new Recipe("Vanilla Cupcakes",
  ["1 1/4 cups all-purpose flour", "1 1/4 tsp baking powder", "1/2 tsp salt", "1/2 cup unsalted butter, softened", "3/4 cup sugar", "2 large eggs, room temperature", "2 tsp pur vanilla extract", "1/2 cup buttermilk, room temperature"],
  ["Preheat the oven to 350°F and line a cupcake/muffin pan with cupcake liners.", "In a medium bowl, whisk together 1 1/4 cups flour, 1 1/4 tsp baking powder, and 1/2 tsp salt. Set flour mix aside.", "In the bowl of an electric mixer, beat butter and sugar on medium-high speed 5 minutes until thick and fluffy, scraping down the bowl as needed.", "Add eggs one at a time, beating well with each addition then scrape down the bowl. Add 2 tsp vanilla and beat to combine.", "Reduce mixer speed to medium and add the flour mixture in thirds alternating with the buttermilk, mixing to incorporate with each addition. Scrape down the bowl as needed and beat until just combined and smooth. Divide the batter evenly into a 12-count lined muffin or cupcake pan, filling 2/3 full.", "Bake for 20-23 minutes at 350 °F, or until a toothpick inserted in the center comes out clean. Let them cool in the pan for 5 minutes, then transfer to a wire rack and cool to room temperature before frosting."],
  "This is the only vanilla cupcake recipe you need! They are perfectly soft, rise evenly and go well with just about any cupcake frosting. The best cupcakes!",
  8, 22, ["Dessert", "Sweet", "Good", "Vanilla", "Cupcake"])

const Pancakes = new Recipe("Old-Fashioned Pancakes",
  ["1 1/2 cups all-purpose flour", "3 1/2 tsp backing powder", "1 tbsp white sugar", "1/4 tsp salt", "1 1/4 cups milk", "3 tablespoons butter, melted", "1 egg"],
  ["Sift flour, baking powder, sugar, and salt together in a large bowl. Make a well in the center and add milk, melted butter, and egg; mix until smooth.", "Heat a lightly oiled griddle or pan over medium-high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake; cook until bubbles form and the edges are dry, about 2 to 3 minutes. Flip and cook until browned on the other side. Repeat with remaining batter."],
  "I found this pancake recipe in my Grandma's recipe book. Judging from the weathered look of this recipe card, this was a family favorite.",
  5, 15, ["Breakfast", "Pancakes"])

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });

        State.featuredRecipe = Pizza;
        await State.recipeBook.getData();

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
