import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDatabase, ref, update } from 'firebase/database';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { BottomNavigation, Snackbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateRecipe } from '../../FireBase/Update';
import { Recipe } from '../../Models/Recipe';
import { useRecipeBookState, useUserState } from '../../state';
import EditCreateRecipe from '../EditCreateRecipe/EditCreateRecipe';
import Discover from '../Discover/Discover';
import Recipes from '../Recipes/Recipes';
import Social from '../Social/Social';
import ViewRecipe from '../ViewRecipe/ViewRecipe';
import { Account } from '../Settings/Components/Account';
import { PublicProfile } from '../Settings/Components/PublicProfile';
import { Friends } from '../Settings/Components/Friends';
import { Settings } from '../Settings/Settings';
import CreatePostScreen from '../Social/Components/CreatePostScreen';
import { PostScreen } from '../Social/Components/PostScreen';
import { Post } from '../../Models/Post';



export type SnackBarData = {
		visible: boolean;
		message?: string;
		action?: {
			label: string;
			onPressCode: "undoDelete";
			recipe?: Recipe 
		}
}



export type RootStackParamList = {
	Appetite: { snackBar?: SnackBarData };
	Recipe: { recipe: Recipe, };
	EditCreate: { recipe?: Recipe };
	Account: undefined;
	PublicProfile: { id: string } | undefined;
	Friends: undefined;
	CreatePost: { linkedRecipe?: Recipe } | undefined;
	PostScreen: { id?: string, post?: Post };
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
				<Stack.Screen name="EditCreate" component={EditCreateRecipe} options={{ gestureEnabled: false }}/>
				<Stack.Screen name="Account" component={Account} />
				<Stack.Screen name="PublicProfile" component={PublicProfile} />
				<Stack.Screen name="Friends" component={Friends} />
				<Stack.Screen name='CreatePost' component={CreatePostScreen} options={{ gestureEnabled: false }} />
				<Stack.Screen name="PostScreen" component={PostScreen} options={{ presentation: "modal" }} />
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
		navigation: NativeStackNavigationProp<RootStackParamList, "Appetite", undefined>;
	}
};


/**
 * Creates the home screen for the app (which is all of the screens in the bottom tab group)
 * @param param0 navigation and route for the screen
 */
function Appetite({navigation, route}: Props) {
	const { colors } = useTheme();
	const { recipeBook, setRecipeBook } = useRecipeBookState();
	const user = useUserState();

	const [index, setIndex] = React.useState(0); // The current tab index
	const [snackBar, setSnackBar] = useState<SnackBarData>({
		visible: false,
		message: "",
		action: undefined
	});
	const routesWithSocial = [
		{ key: 'recipes', title: 'Recipes', focusedIcon: 'book', unfocusedIcon: "book-outline", navigation: navigation },
		{ key: 'discover', title: 'Discover', focusedIcon: 'magnify', navigation: navigation },
		{ key: 'social', title: 'Social', focusedIcon: 'message', unfocusedIcon: "message-outline", navigation: navigation },
		{ key: 'settings', title: 'Settings', focusedIcon: 'dots-horizontal', navigation: navigation },
	]
	const routesWithoutSoical = [
		{ key: 'recipes', title: 'Recipes', focusedIcon: 'book', unfocusedIcon: "book-outline", navigation: navigation },
		{ key: 'discover', title: 'Discover', focusedIcon: 'magnify', navigation: navigation },
		{ key: 'settings', title: 'Settings', focusedIcon: 'dots-horizontal', navigation: navigation },
	]
	// This creates the different tabs on the bottom
	const [routes, setRoutes] = React.useState(routesWithSocial);
	``
	useEffect(() =>{
		if (route.params) {
			if (route.params.snackBar) {
				setSnackBar({
					visible: route.params.snackBar.visible,
					message: route.params.snackBar.message ? route.params.snackBar.message : "",
					action: route.params.snackBar.action ? route.params.snackBar.action : undefined
				})
			}
		}
	}, [route.params])
	
	useEffect(() => {
		if (user) {
			if (routes.length == 3 && index == 2) {
				setIndex(3);
			}
			setRoutes(routesWithSocial);
		}
		else {
			setRoutes(routesWithoutSoical);
			if (index == 3) {
				setIndex(2);
			}
		}
	}, [user])

	// This is all the different screens that get displayed with the designated tab
	const renderScene = BottomNavigation.SceneMap({
		recipes: Recipes as any,
		discover: Discover as any,
		social: Social as any,
		settings: Settings as any,
	});

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['right', 'left']}>
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				shifting={true}
				sceneAnimationEnabled
				sceneAnimationType="opacity"
			/>

			<Snackbar
				visible={snackBar.visible}
				onDismiss={() => { setSnackBar({ ...snackBar, visible: false }) }}
				duration={3000}
				action={ snackBar.action ? {
					label: snackBar.action?.label,
					onPress: () => {
						if (snackBar.action?.onPressCode === "undoDelete" && snackBar.action.recipe) {
							// Try to re-add the recipe to the recipe book
							const addRecipeResult = recipeBook.addRecipe(snackBar.action.recipe);
							if (addRecipeResult.success) {
								// Save and update the state
								setRecipeBook(recipeBook);

								updateRecipe(user, snackBar.action.recipe, true);

								// Navigate to the new recipe
								navigation.navigate("Recipe", { recipe: snackBar.action.recipe });
							}
							else {
								setSnackBar({ visible: true, message: addRecipeResult.message })
							}
						}
					}
				} : undefined}
			>
				{snackBar.message}
			</Snackbar>
		</SafeAreaView>
	)
}




