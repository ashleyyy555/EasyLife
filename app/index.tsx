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
                const userDocRef = doc(db, "users", user.uid);
                const operatorDocRef = doc(db, "operators", user.uid);

                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    // User found in 'users' collection
                    if (userDocSnap.data()?.init === true) {
                        router.replace("/Public/home"); // route for normal users
                    } else {
                        router.replace("/EnterUserDetails");
                    }
                } else {
                    // If not found in users, check operators
                    const operatorDocSnap = await getDoc(operatorDocRef);
                    if (operatorDocSnap.exists()) {
                        if (operatorDocSnap.data()?.init === true) {
                            router.replace("/Operators/home"); // route for operators
                        } else {
                            router.replace("/EnterOperatorDetails"); // operator-specific route if needed
                        }
                    } else {
                        // Not found in either collection — maybe log out or redirect to register
                        router.replace("/register");
                    }
                }
            } else {
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