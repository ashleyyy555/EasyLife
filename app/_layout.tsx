import { Stack } from "expo-router";
import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
    return (
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
                name="index"
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => console.log("Settings Pressed")}>
                            <Ionicons name="settings-outline" size={24} style={{ marginLeft: 15 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}
