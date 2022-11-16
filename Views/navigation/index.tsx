import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Recipes from '../Recipes';
import Settings from '../Settings';
import TabOneScreen from '../TabOneScreen';
import LinkingConfiguration from './LinkingConfiguration';


export default function Navigation() {

	const Stack = createNativeStackNavigator();

 	return (
		<NavigationContainer linking={LinkingConfiguration} >
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
	const [routes] = React.useState([
		{ key: 'recipes', title: 'Recipes', focusedIcon: 'silverware-fork' },
		{ key: 'something', title: 'Something', focusedIcon: 'cloud' },
		{ key: 'something1', title: 'Something1', focusedIcon: 'cloud' },
		{ key: 'something2', title: 'Something2', focusedIcon: 'cloud' },
		{ key: 'settings', title: 'Settings', focusedIcon: 'dots-horizontal' },
	]);

	const renderScene = BottomNavigation.SceneMap({
		recipes: Recipes,
		something: TabOneScreen,
		something1: TabOneScreen,
		something2: TabOneScreen,
		settings: Settings,
	});
	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				shifting={true}
			/>
		</SafeAreaView>
	)
}