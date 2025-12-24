import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { auth } from './firebaseConfig';

import useCachedResources from './hooks/useCachedResources';
import { User } from './Models/User';
import { GlobalStateProvider, State, useSettingsState, useUserState } from './state';
import { themes } from './themes';
import Navigation from './Views/navigation';

export default function App() {
	const isLoadingComplete = useCachedResources();
	
	if (!isLoadingComplete) {
		return null;
	} else {

		return (
			<GlobalStateProvider>
				<RestOfApp />
			</GlobalStateProvider>
		);
	}
}


function RestOfApp() {

	const colorScheme = useColorScheme();
	const { settings } = useSettingsState();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider theme={colorScheme === 'dark' ? themes[settings.themeColor].dark : themes[settings.themeColor].light}>
				<SafeAreaProvider>
					<Navigation />
					<StatusBar />
				</SafeAreaProvider>
			</Provider>
		</GestureHandlerRootView>
	)
}