import { Image, Text, View, SafeAreaView, Pressable } from "react-native";
import { useColorScheme } from "react-native";
import {router} from "expo-router";
import "./global.css";
import {useTheme} from "../context/ThemeContext";

export default function Home() {
    const { theme } = useTheme();
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="items-center">
                <Image source={require("../assets/images/EasyLife-logo.png")} style={{ width: '70%', height: '20%', marginTop: 30 }}/>
            </View>
            <View className="justify-center items-center">
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/new-screen")} // Navigate to new screen
                    className="bg-emergency justify-center items-center"
                    style={{
                        width: 360,
                        height: 154,
                        borderRadius: 54,
                    }}
                >
                    <Text className="text-white text-lg font-bold">EMERGENCY</Text>
                </Pressable>
            </View>
            <View className="flex-row justify-center items-center gap-x-7 mt-4">
                <Pressable
                    onPress={() => router.push("/new-screen")} // Navigate to new screen
                    className="bg-medical-records justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <Text className="text-white text-lg font-bold">+</Text>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/MapViewer")} // Navigate to new screen
                    className="bg-location justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <Text className="text-white text-lg font-bold">-</Text>
                </Pressable>
            </View>

            <View className="justify-center items-center mt-4">
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/new-screen")} // Navigate to new screen
                    className="bg-reports justify-center items-center"
                    style={{
                        width: 360,
                        height: 154,
                        borderRadius: 54,
                    }}
                >
                    <Text className="text-black text-lg font-bold">REPORTS</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
