import {View, Text, useColorScheme} from "react-native";
import {useTheme} from "../context/ThemeContext";

export default function NewScreen() {
    const { theme } = useTheme();
    const colorScheme = useColorScheme();

    return (
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
            <Text className="text-xl font-bold text-white">Emergency Page</Text>
        </View>
    );
}
