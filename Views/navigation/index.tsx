import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Recipe } from '../../Models/Recipe';
import FeaturedRecipe from '../FeaturedRecipe';
import Recipes from '../Recipes';
import Settings from '../Settings';
import Social from '../Social';
import ViewRecipe from '../ViewRecipe';

export type RootStackParamList = {
	Appetite: undefined, // undefined because we aren't passing any params.
	Recipe: { recipe: Recipe };
};


const Stack = createNativeStackNavigator<RootStackParamList>();


/**
 * This is the root navigation for the entire application.
 */
export default function Navigation() {
 	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Appetite' screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Appetite" component={Appetite} />
				<Stack.Screen name="Recipe" component={ViewRecipe} />
			</Stack.Navigator>
      </NavigationContainer>
  );
}


type Props = NativeStackScreenProps<RootStackParamList, 'Appetite'>;
export type Route = {
	route: {
		key: string;
		title: string;
		focusedIcon: string;
		unfocusedIcon: string;
		navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined>
	}
};


/**
 * Creates the home screen for the app (which is all of the screens in the bottom tab group)
 * @param param0 navigation and route for the screen
 */
function Appetite({navigation, route}: Props) {
	const [index, setIndex] = React.useState(0); // The current tab index
	const { colors } = useTheme();
	
	// This creates the different tabs on the bottom
	const [routes] = React.useState([
		{ key: 'recipes', title: 'Recipes', focusedIcon: 'book', unfocusedIcon: "book-outline", navigation: navigation },
		{ key: 'featuredRecipe', title: 'Featured', focusedIcon: 'silverware-fork', navigation: navigation },
		{ key: 'social', title: 'Social', focusedIcon: 'message', unfocusedIcon: "message-outline", navigation: navigation },
		{ key: 'settings', title: 'Settings', focusedIcon: 'dots-horizontal', navigation: navigation },
	]);

	// This is all the different screens that get displayed with the designated tab
	const renderScene = BottomNavigation.SceneMap({
		recipes: Recipes as any,
		featuredRecipe: FeaturedRecipe as any,
		social: Social as any,
		settings: Settings as any,
	});

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'right', 'left']}>
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				shifting={true}
				sceneAnimationType="opacity"
			/>
		</SafeAreaView>
	)
}