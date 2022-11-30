import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import { darkTheme, lightTheme } from './theme';
import Navigation from './Views/navigation';

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<Provider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
					<Navigation />
					<StatusBar />
				</Provider>
			</SafeAreaProvider>
		);
	}
}