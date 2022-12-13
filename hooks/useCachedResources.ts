import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Recipe } from '../Models/Recipe';
import { State, useFeaturedRecipeState } from '../state';


const Pizza = new Recipe("Air-Fryer Sausage Pizza",
  ["1 loaf frozen bread dough, thawed", "1 cup pizza sauce", "1/2 pound bulk Italian sausage, cooked and drained", "1-1/3 cups shredded part-skim mozzarella cheese", "1 small green pepper, sliced into rings", "1 tsp dried oregano", "Crushed red pepper flakes, optional"],
  ["On a lightly floured surface, roll and stretch dough into four 4-in. circles. Cover; let rest for 10 minutes.", "Preheat air fryer to 400°. Roll and stretch each dough into a 6-in. circle. Place 1 crust on greased tray in air-fryer basket. Carefully spread with 1/4 cup pizza sauce, 1/3 cup sausage, 1/3 cup cheese, a fourth of the green pepper rings and a pinch of oregano. Cook until crust is golden brown, 6-8 minutes. If desired, sprinkle with red pepper flakes. Repeat with remaining ingredients."],
  30, 10, ["Pizza", "Supper", "Air-Fryer"], true)



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
