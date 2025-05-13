import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/FirebaseConfig";
import {router} from "expo-router"; // Update path if needed
import "./global.css";


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Account Created!");
            // 🚀 Navigate to login or dashboard
            router.replace('/EnterUserDetails');
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 p-6 justify-center bg-[#121212]">
            <Text className="text-[28px] font-bold mb-6 text-white text-center">Create an Account</Text>

            <TextInput
                className="bg-[#1E1E1E] p-3.5 rounded-lg mb-4 text-white"
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                className="bg-[#1E1E1E] p-3.5 rounded-lg mb-4 text-white"
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                className="bg-[#1E1E1E] p-3.5 rounded-lg mb-4 text-white"
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity className="bg-[#1E88E5] p-4 rounded-lg items-center mt-2" onPress={handleRegister} disabled={loading}>
                <Text className="text-white font-bold">{loading ? "Creating Account..." : "Sign Up"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text className="text-[#aaa] mt-4 text-center">Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
}


