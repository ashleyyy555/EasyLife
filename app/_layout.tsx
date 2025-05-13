import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Portal, Provider } from 'react-native-paper';
import LoadingSpinner from "@/components/LoadingSpinner"; // Make sure to create this or use your existing loading spinner component
import { ProfileProvider } from "@/context/ProfileContext"; // Import ProfileProvider


import { useNavigation } from '@react-navigation/native';
import SideMenu from '@/components/SideMenu';

export default function Layout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [user, setUser] = useState(null); // Add user state
    const [authLoading, setAuthLoading] = useState(true); // Add authLoading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("🔥 onAuthStateChanged triggered");
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                console.log("✅ firebaseUser exists", firebaseUser);

                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("userDoc exists")
                    if (userData.profilePicUrl) {
                        // If profilePicUrl exists, set the selectedImage state
                        setSelectedImage(userData.profilePicUrl);
                        console.log("Image Fetched");
                    }
                }
            }
            setAuthLoading(false); // Set authLoading to false after user state is fetched
        });

        return () => unsubscribe();
    }, []);

    // If authentication is still loading, show a spinner
    if (authLoading) return <LoadingSpinner />;

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
                            uri: selectedImage || "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png",
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
                            }}
                        >
                            <SideMenu isOpen={menuVisible} setIsOpen={setMenuVisible} />
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
                        headerShown: false,
                        headerTitle: () => <View />, // Removes the default title
                        headerTransparent: true, // Makes header see-through
                        headerRight: () => <HeaderRight />,
                        headerBackTitle: "Back",
                        headerLeft: () => <HeaderLeft />,
                    }}
                >
                    <Stack.Screen
                        name="Public/home"
                        options={{
                            headerLeft: () => null,
                        }}
                    />
                </Stack>
            </ThemeProvider>
        </Provider>
    );
}
