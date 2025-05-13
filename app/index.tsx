import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { auth, db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as FileSystem from 'expo-file-system'; // Import file system module

export default function Index() {

    const PROFILE_IMAGE_PATH = FileSystem.documentDirectory + "profileImage.jpg"; // Set the path for the profile image

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("✅ User signed out");
        } catch (error) {
            console.error("❌ Error signing out:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // ✅ Check if init is TRUE before navigating
                const initDocRef = doc(db, "users", user.uid);
                const initDocSnap = await getDoc(initDocRef);

                if (initDocSnap.exists() && initDocSnap.data()?.init === true) {
                    router.replace("/Public/home");
                } else {
                    router.replace("/EnterUserDetails");
                }

            } else {
                // If the user is not authenticated, navigate to the register page
                router.replace("/register");
            }
        });

        return () => unsubscribe();
    }, []);



    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>Loading...</Text>
        </View>
    );
}