import { View } from "react-native";
import { Menu, TouchableRipple, Text, IconButton } from "react-native-paper";
import { useSettingsState } from "../../../state";
import { BottomModal } from "../../components/BottomModal";



const colors = {
    red: "rgb(192, 1, 0)",
    orange: "rgb(225, 140, 50)",
    yellow: "rgb(205, 205, 0)",
    green: "rgb(0, 109, 61)",
    blue: "rgb(52, 61, 255)",
    indigo: "rgb(73, 81, 195)",
    purple: "rgb(123, 65, 179)",
    pink: "rgb(154, 64, 87)",
}

export function ThemeColorPicker({ modalVisible, setModalVisible }: { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    
    const {settings, setSettings} = useSettingsState();

    function changeColor(color: keyof typeof colors) {
        setModalVisible(false);
        setTimeout(() => {
            settings.themeColor = color;
            setSettings({...settings});
        }, 250);
    }
    
    return (
        <BottomModal visible={modalVisible} setVisible={setModalVisible}>
            <View style={{ padding: 10 }}>
                {
                    Object.keys(colors).map((color: any) => {
                        return <TouchableRipple onPress={() => changeColor(color)} key={color} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingHorizontal: 30, paddingLeft: 45 }}>
                                <Text variant="titleMedium" style={{ color: colors[color as keyof typeof colors] }}>{color}</Text>
                                <IconButton icon="circle" iconColor={colors[color as keyof typeof colors]} />
                            </View>
                        </TouchableRipple>
                    })
                }
            </View>
        </BottomModal>
    )
}