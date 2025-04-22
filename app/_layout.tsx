import {router, Stack} from "expo-router";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Portal, Provider } from 'react-native-paper';
import { auth } from "@/FirebaseConfig";
import { signOut } from "firebase/auth";


export default function Layout() {
    const [menuVisible, setMenuVisible] = useState(false);

    // Top Left Settings button for home.tsx
    const HeaderLeft = () => {
        const { theme } = useTheme();

        return (
            <TouchableOpacity onPress={() => console.log("Settings Pressed")}>
                <Ionicons name="settings-outline" size={24} style={{ marginLeft: 15, color: theme.text }} />
            </TouchableOpacity>
        );
    };

    const HeaderRight = () => {
        const { theme } = useTheme();


        function profileClick() {
            setMenuVisible(!menuVisible);
        }

        return (
            <View className="relative mr-4">
                <TouchableOpacity onPress={() => profileClick()}>
                    <Image
                        source={{
                            uri: "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png",
                        }}
                        className="w-10 h-10 rounded-full"
                    />
                </TouchableOpacity>

                <Portal>
                    {menuVisible && (
                        <View
                            className="absolute top-12 right-0 bg-white rounded-lg p-3 shadow-lg z-50"
                            style={{
                                opacity: menuVisible ? 1 : 0,
                                pointerEvents: menuVisible ? "auto" : "none",
                                marginTop: 60,
                            }}
                        >
                            <TouchableOpacity onPress={() => handleSignOut()}>
                                <Text className="py-2 text-base text-black">Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Portal>
            </View>
        );
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Signed out successfully!");
            setMenuVisible(false);
            router.replace("/");
            // Navigate the user to login screen if needed
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    return (
        <Provider>
            <ThemeProvider>
                <Stack
                    screenOptions={{
                        headerTitle: () => <View />, // Removes the default title
                        headerTransparent: true, // Makes header see-through
                        headerRight: () => <HeaderRight />,
                        headerBackTitle: "Back",
                    }}
                >
                    {/* Override `headerLeft` for home.tsx only */}
                    <Stack.Screen
                        name="Public/home"
                        options={{
                            headerLeft: () => <HeaderLeft />,
                        }}
                    />
                </Stack>
            </ThemeProvider>
        </Provider>
    );
}
