import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { RootStackParamList } from "../../navigation";
import { Text } from "react-native-paper"



type navProps = NativeStackScreenProps<RootStackParamList, 'PostScreen'>;


export function PostScreen({navigation, route}: navProps) {
    




    return (
        <View>
            <Text>This is a post screen!!!!!!!!!!!!!</Text>
        </View>
    )
}