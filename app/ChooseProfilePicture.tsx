import {Pressable, Text, TextInput, View, Image} from "react-native";
import {useTheme} from "@/context/ThemeContext";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { RadioButton } from "react-native-paper"; // Import RadioButton
import {auth, db} from "@/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';


export default function ChooseProfilePicture() {
    const { theme } = useTheme();

    const [user, setUser] = useState(null);
    const [gender, setGender] = useState("");

    // User Details
    const [fullName, setFullName] = useState("");
    const [icNumber, setIcNumber] = useState("");
    const [address, setAddress] = useState("");
    const [state, setState] = useState("");
    const [postCode, setPostCode] = useState("");
    const [phone, setPhone] = useState("");


    const handleGenderChange = (value: string) => {
        setGender(value); // Update gender selection
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
            }
        });

        return () => unsubscribe();
    }, []);



    function calculateBirthday() {
        const birthDateStr = icNumber.slice(0,6);

        const day = parseInt(birthDateStr.slice(0, 2));
        const month = parseInt(birthDateStr.slice(2, 4));
        const year = parseInt(birthDateStr.slice(4, 6));

        const fullYear = year < 50 ? 2000 + year : 1900 + year;

        return new Date(fullYear, month - 1, day);
    }

    const handleSubmit = async () => {
        if (!user || gender.trim() === "") return;

        try {
            // @ts-ignore
            await setDoc(doc(db, "users", user.uid), {
                gender: gender.trim(),
            }, { merge: true });

            setGender("");
        } catch (error) {
            console.error("Error updating gender:", error);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="flex-1 px-4" style={{ backgroundColor: theme.background, marginTop: 150 }}>
                <View className="items-center">
                    <Text className="text-4xl font-bold mb-2" style={{ color: theme.text }}>Choose Profile Picture</Text>
                    <View style={{ position: "relative", marginTop: 50, marginBottom: 50}}>
                        <Image
                            source={require("@/assets/images/lzj.jpeg")}
                            style={{ width: 300, height: 300, borderRadius: 150, borderColor: theme.text, borderWidth: 2 }}
                        />

                        <Ionicons
                            name="camera-outline"
                            size={40}
                            color={theme.text}
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                right: 10,
                                backgroundColor: theme.background,
                                borderRadius: 30,
                                padding: 5,
                                borderWidth: 2,
                                borderColor: theme.text,
                            }}
                        />
                    </View>
                </View>


                <View className="flex-row justify-center items-center">
                    <Pressable onPress={handleSubmit} className="bg-blue-600 px-4 py-2 rounded mt-2">
                        <Text className="text-white font-semibold">Submit</Text>
                    </Pressable>
                </View>

            </View>
        </View>

    );
}
