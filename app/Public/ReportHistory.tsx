import { SafeAreaView , ScrollView ,View, Text, TextInput, Pressable, Image, TouchableOpacity , Modal} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig"; // use your config here
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import CheckmarkIcon from "@/components/CheckmarkIcon";
import AlertIcon from "@/components/AlertIcon";
import { router } from "expo-router";



export default function ReportHistory() {
    const { theme } = useTheme();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                await fetchInformation(firebaseUser.uid);


                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();

                }
            }
        });

        return () => unsubscribe();
    }, []);




    const fetchInformation = async (uid: string) => {
        try {
            const docRef = doc(db, "users", uid);
            const snapshot = await getDoc(docRef);
            const medicalDocRef = doc(db, "users", uid, "MedicalInformation", "main");
            const medicalSnapshot = await getDoc(medicalDocRef);


            if (snapshot.exists()) {
                const data = snapshot.data();

            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    // @ts-ignore
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView>
                <View className="items-center px-4" style={{ backgroundColor: theme.background }}>
                    {/* Header */}
                    <View className="flex-row items-center" style={{ backgroundColor: theme.background }}>
                        <View>
                            <Text className="font-bold text-white text-3xl">Report History</Text>
                        </View>
                    </View>

                    {/* Ongoing Reports Section */}
                    <View className="w-full mt-6">
                        <Text
                            className="text-white font-bold text-xl mb-2"
                            style={{ alignSelf: "flex-start" }}
                        >
                            Ongoing Reports
                        </Text>

                        <View style={{ backgroundColor: '#1E1E1E'}}>
                            <Pressable className="p-4 rounded-lg">
                                <View className="flex-row items-center gap-4">
                                    <AlertIcon className="mr-4" size={40} />
                                    <View className="flex gap-1">
                                        <Text className="text-white text-2xl font-bold">Report 1</Text>
                                        <Text className="text-white text-l">17 May 2025</Text>
                                    </View>
                                </View>
                            </Pressable>

                            <Pressable className="p-4 rounded-lg">
                                <View className="flex-row items-center gap-4">
                                    <AlertIcon className="mr-4" size={40} />
                                    <View className="flex gap-1">
                                        <Text className="text-white text-2xl font-bold">Report 2</Text>
                                        <Text className="text-white text-l">27 February 2025</Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    {/* Past Reports Section */}
                    <View className="w-full mt-6">
                        <Text
                            className="text-white font-bold text-xl mb-2"
                            style={{ alignSelf: "flex-start" }}
                        >
                            Past Reports
                        </Text>

                        <View style={{ backgroundColor: '#1E1E1E'}}>
                            <Pressable className="p-4 rounded-lg">
                                <View className="flex-row items-center gap-4">
                                    <CheckmarkIcon className="mr-4" size={40} />
                                    <View className="flex gap-1">
                                        <Text className="text-white text-2xl font-bold">Report 1</Text>
                                        <Text className="text-white text-l">17 May 2025</Text>
                                    </View>
                                </View>
                            </Pressable>

                            <Pressable className="p-4 rounded-lg">
                               <View className="flex-row items-center gap-4">
                                   <CheckmarkIcon className="mr-4" size={40} />
                                   <View className="flex gap-1">
                                       <Text className="text-white text-2xl font-bold">Report 2</Text>
                                       <Text className="text-white text-l">27 February 2025</Text>
                                   </View>
                               </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
