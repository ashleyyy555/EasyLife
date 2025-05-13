import { View, Text, TextInput, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig"; // use your config here
import Map from "@/components/Map";

export default function MapViewer() {
    const { theme } = useTheme();


    return (
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: theme.background }}>
           <Map/>
            <Text className="text-white">Hi</Text>
        </View>
    );
}
