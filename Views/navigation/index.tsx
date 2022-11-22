import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeaturedRecipe from '../FeaturedRecipe';
import Recipes from '../Recipes';
import Settings from '../Settings';
import Social from '../Social';


export default function Navigation() {

	const Stack = createNativeStackNavigator();

 	return (
		<NavigationContainer>
			<Stack.Navigator>
			<Stack.Screen
				name="Appetite"
				component={BottomTabs}
				options={{
					headerShown: false
				}}
			/>
			</Stack.Navigator>
      </NavigationContainer>
      
  );
}


// TODO: Documentation
function BottomTabs() {
	const [index, setIndex] = React.useState(0);
	const { colors } = useTheme();

	const [routes] = React.useState([
		{ key: 'recipes', title: 'Recipes', focusedIcon: 'book', unfocusedIcon: "book-outline" },
		{ key: 'featuredRecipe', title: 'Featured', focusedIcon: 'silverware-fork' },
		{ key: 'social', title: 'Social', focusedIcon: 'message', unfocusedIcon: "message-outline" },
		{ key: 'settings', title: 'Settings', focusedIcon: 'dots-horizontal' },
	]);

	const renderScene = BottomNavigation.SceneMap({
		recipes: Recipes,
		featuredRecipe: FeaturedRecipe,
		social: Social,
		settings: Settings,
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