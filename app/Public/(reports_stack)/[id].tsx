import { SafeAreaView , ScrollView ,View, Text, TextInput, Pressable, Image, TouchableOpacity , Modal} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where } from "firebase/firestore";
import { auth, db, storage } from "@/FirebaseConfig"; // use your config here
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import LocationkIcon from "@/components/LocationIcon";
import AlertIcon from "@/components/AlertIcon";
import { Stack, router, useLocalSearchParams } from "expo-router";



export default function DetailedReport() {
    const { theme } = useTheme();
    const { id } = useLocalSearchParams();

    // useStates for Fetching information
    const [status, setStatus] = useState();
    const [date, setDate] = useState(new Date());

    const [loading, setLoading] = useState(true);
    const [transcribedText, setTranscribedText] = useState("");
    const [emergencyService, setEmergencyService] = useState("");
    const [operatorId, setOperatorId] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (firebaseUser) {
                console.log("User detected:", firebaseUser.uid); // ✅
                console.log(id);
                await fetchReports(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);




    const fetchReports = async (uid: string) => {
        setLoading(true);
        try {
            const reportsRef = doc(db, "reports", id);
            const reportDoc = await getDoc(reportsRef);


            if (reportDoc.exists()) {
                const reportData = reportDoc.data();
                setDate(reportData.date);
                setTranscribedText(reportData.transcribedText);
                setStatus(reportData.status);
                setOperatorId(reportData.assignedOperator);
                setEmergencyService(reportData.assignedEmergencyService);
            }
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
                        <Text className="font-bold text-white text-3xl">Report {id}</Text>

                        <View style={{ backgroundColor: "#87F99C", borderRadius: 16, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8 }}>
                            <Text className="font-bold text-xl text-[#007D13]">Complete</Text>
                        </View>
                    </View>

                    <View className="self-center mt-4" style={{ width: "90%"}}>
                        <Text className="font-bold text-2xl text-white">
                            { date
                                ? new Date(date).toLocaleDateString(undefined, {
                                    day: "2-digit",
                                    year: 'numeric',
                                    month: 'long',
                                })
                                : "Invalid Date"
                            }
                        </Text>
                    </View>

                    <View className="flex-row items-center self-center mt-4" style={{ width: "90%"}}>
                        <LocationkIcon size={20} color={theme.text} />
                        <Text className="ml-2 font-bold text-xl text-white">Taylor's Lakeside Campus</Text>
                    </View>

                    <View className="self-center mt-4" style={{ width: "90%", height: 1, backgroundColor: '#888' }} />

                    <View className="self-center mt-4" style={{ width: "90%"}}>
                        <Text className="font-bold text-2xl text-white">Report Message</Text>

                        <Text className="font-bold text-l text-white mt-2">{transcribedText}</Text>
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
                               <Text className="font-bold text-l text-white mt-1">{emergencyService}</Text>
                           </View>
                       </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
