import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createGlobalStyles } from "../../styles/globalStyles";
import { SettingsStackParamList } from "../Settings";
import { Header } from "./Header";




type AccountInfoNavProps = NativeStackScreenProps<SettingsStackParamList, 'Account'>;

export function Account({ navigation }: AccountInfoNavProps) {
    
    const globalStyles = createGlobalStyles();

    return (
        <View style={globalStyles.container}>
            <Header title="Account" onBack={navigation.goBack} />

            

        </View>
    )
}