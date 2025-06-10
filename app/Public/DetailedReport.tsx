import { SafeAreaView , ScrollView ,View, Text, TextInput, Pressable, Image, TouchableOpacity , Modal} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDocs, setDoc, collection, query, where } from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig"; // use your config here
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import LocationkIcon from "@/components/LocationIcon";
import AlertIcon from "@/components/AlertIcon";
import { router } from "expo-router";



export default function ReportHistory() {
    const { theme } = useTheme();

    // useStates for Fetching information
    const [user, setUser] = useState(null);
    const [ongoingReports, setOngoingReports] = useState([]);
    const [pastReports, setPastReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (firebaseUser) {
                console.log("User detected:", firebaseUser.uid); // ✅
                setUser(firebaseUser);
                await fetchReports(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);




    const fetchReports = async (uid: string) => {
        setLoading(true);
        try {
            const reportsRef = collection(db, "reports");
            const q = query(reportsRef, where("userId", "==", uid));
            const querySnapshot = await getDocs(q);


            const ongoing: any[] = [];
            const past: any[] = [];

            querySnapshot.forEach((doc) => {
                const report = { id: doc.id, ...doc.data()};
                if (report.status === "Active") {
                    ongoing.push(report);
                } else if (report.status === "Complete") {
                    past.push(report);
                }
            });

            ongoing.reverse();
            past.reverse();
            setOngoingReports(ongoing);
            setPastReports(past);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };


    // @ts-ignore
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView>
                <View className="px-4" style={{ backgroundColor: theme.background }}>
                    <View className="flex-row justify-between items-center self-center" style={{ backgroundColor: theme.background, width: "90%" }}>
                        <Text className="font-bold text-white text-3xl">Report 10</Text>

                        <View style={{ backgroundColor: "#87F99C", borderRadius: 16, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8 }}>
                            <Text className="font-bold text-xl text-[#007D13]">Complete</Text>
                        </View>
                    </View>

                    <View className="self-center mt-4" style={{ width: "90%"}}>
                        <Text className="font-bold text-2xl text-white">17 May 2025</Text>
                    </View>

                    <View className="flex-row items-center self-center mt-4" style={{ width: "90%"}}>
                        <LocationkIcon size={20} color={theme.text} />
                        <Text className="ml-2 font-bold text-xl text-white">Taylor's Lakeside Campus</Text>
                    </View>

                    <View className="self-center mt-4" style={{ width: "90%", height: 1, backgroundColor: '#888' }} />

                    <View className="self-center mt-4" style={{ width: "90%"}}>
                        <Text className="font-bold text-2xl text-white">Report Message</Text>

                        <Text className="font-bold text-l text-white mt-2">Please help me, I'm stuck in my car</Text>
                    </View>

                    <View className="self-center mt-6" style={{ width: "90%", height: 1, backgroundColor: '#888' }} />

                    <View className="self-center mt-4" style={{ width: "90%"}}>
                        <Text className="font-bold text-2xl text-white">Emergency Operator</Text>

                       <View className="flex-row items-center mt-4">
                           <Image
                               source={
                                   selectedImage
                                       ? { uri: selectedImage }
                                       : require("@/assets/images/cloud-upload-outline.jpg")
                               }
                               style={{ width: 60, height: 60, borderRadius: 150, borderColor: theme.text, borderWidth: 2 }}
                           />

                           <View className="ml-4 items-start">
                               <Text className="font-bold text-2xl text-white">Yuki Tsunoda</Text>
                               <Text className="font-bold text-l text-white mt-1">Red Bull Police Station</Text>
                           </View>
                       </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
