import { View, Text, TextInput, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig"; // use your config here
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import {onAuthStateChanged} from "firebase/auth";

export default function MedicalRecords() {
    const { theme } = useTheme();
    const [userId, setUserId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUserId(firebaseUser.uid)
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View className="flex-1 items-center px-4" style={{ backgroundColor: theme.background }}>
                <Text className="text-white">{userId}</Text>
            </View>
        </SafeAreaView>
    );
}
