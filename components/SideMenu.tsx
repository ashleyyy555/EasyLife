// components/SideMenu.tsx
import { StatusBar, View, Text, Animated, SafeAreaView } from 'react-native';
import { useRef, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router'



type SideMenuProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};

const SideMenu = ({ isOpen, setIsOpen } : SideMenuProps) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const menuWidth = SCREEN_WIDTH * 0.3;
    const translateX = useRef(new Animated.Value(menuWidth)).current;


    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpen ? 0 : menuWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const SignOutButton = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("User signed out");
                router.replace("/register");
                setIsOpen(false);
                // Optionally navigate to login screen here
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };


    return (
        <Animated.View
            style={{
                transform: [{ translateX }],
                width: menuWidth,
                minHeight: SCREEN_HEIGHT,
            }}
            className="absolute top-0 right-0 bottom-0 bg-white shadow-lg p-5 z-50"
        >
            <Text className="text-lg font-semibold mb-4">Menu</Text>
            <Text className="text-base" onPress={() => setIsOpen(false)}>Close</Text>
            <Text className="text-base" onPress={SignOutButton}>Sign Out</Text>
        </Animated.View>
    );
};

export default SideMenu;
