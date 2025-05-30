import { Image, Text, View, SafeAreaView, Pressable } from "react-native";
import { useColorScheme } from "react-native";
import {router} from "expo-router";
import "../global.css";
import {useTheme} from "@/context/ThemeContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicalRecordsIcon from "@/components/MedicalRecordsIcon";
import LocationIcon from "@/components/LocationIcon";


export default function Home() {
    const { theme } = useTheme();
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="justify-center items-center" style={{ paddingTop: insets.top }}>
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/Public/emergencyReport")} // Navigate to new screen
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
                    onPress={() => router.push("/Public/ProfilePage")} // Navigate to new screen
                    className="bg-medical-records justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <MedicalRecordsIcon size={99}/>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/Public/MapViewer")} // Navigate to new screen
                    className="bg-location justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <LocationIcon size={99}/>
                </Pressable>
            </View>

            <View className="justify-center items-center mt-4">
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/EnterUserDetails")} // Navigate to new screen
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
