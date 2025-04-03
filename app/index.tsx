import { Image, Text, View, SafeAreaView, Pressable } from "react-native";
import {router} from "expo-router";
import "./global.css";

export default function Index() {
    return (
        <SafeAreaView className="flex-1">
            <View className="items-center">
                <Image source={require("../assets/images/EasyLife-logo.png")} style={{ width: '70%', height: '20%', marginTop: 30 }}/>
            </View>
            <View className="justify-center items-center">
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/new-screen")} // Navigate to new screen
                    className="bg-blue-500 justify-center items-center"
                    style={{
                        width: 360,
                        height: 154,
                        borderRadius: 54,
                    }}
                >
                    <Text className="text-white text-lg font-bold">EMERGENCY</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
