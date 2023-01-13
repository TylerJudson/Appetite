import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { createGlobalStyles } from "../../styles/globalStyles";
import { SettingsStackParamList } from "../Settings";
import { Header } from "./Header";




type NavProps = NativeStackScreenProps<SettingsStackParamList, 'PublicProfile'>;

export function PublicProfile({ navigation }: NavProps) {

    const globalStyles = createGlobalStyles();


    return (
        <View style={globalStyles.container}>
            <Header title="Public Profile" onBack={navigation.goBack} />
        </View>
    )
}