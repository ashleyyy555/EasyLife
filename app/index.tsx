import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { auth } from "@/FirebaseConfig";
import { router } from "expo-router"; // Update path if needed

export default function Index() {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // If the user is authenticated, navigate to the home page
                // router.replace("/Public/home");
                router.replace("/EnterUserDetails");
            } else {
                // If the user is not authenticated, navigate to the register page
                // @ts-ignore
                // router.replace("register");
                router.replace("/login");
            }
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>Loading...</Text>
        </View>
    );
}
