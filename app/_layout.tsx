import { Stack } from "expo-router";
import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider } from "../context/ThemeContext";
import {useTheme} from "../context/ThemeContext";

export default function Layout() {
    // Top Left Settings button for home.tsx
    const HeaderLeft = () => {
        const { theme } = useTheme();

        return (
            <TouchableOpacity onPress={() => console.log("Settings Pressed")}>
                <Ionicons name="settings-outline" size={24} style={{marginLeft: 15, color: theme.text}} />
            </TouchableOpacity>
        )
    }

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerTitle: "", // Removes the default title
                    headerTransparent: true, // Makes header see-through
                    headerRight: () => (
                        <TouchableOpacity onPress={() => console.log("Profile Pressed")}>
                            <Image
                                source={{
                                    uri: "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png",
                                }}
                                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 15 }}
                            />
                        </TouchableOpacity>
                    ),
                }}
            >
                {/* Override `headerLeft` for index.tsx only */}
                <Stack.Screen
                    name="home"
                    options={{
                        headerLeft: () => <HeaderLeft />,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );

}
