import {Pressable, Text, TextInput, View} from "react-native";
import {useTheme} from "@/context/ThemeContext";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, setDoc, addDoc, collection, updateDoc} from "firebase/firestore";
import { RadioButton } from "react-native-paper"; // Import RadioButton
import {auth, db} from "@/FirebaseConfig";
import {router} from "expo-router"; // use your config here


export default function EnterMedicalInformation() {
    const { theme } = useTheme();

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");

    // User Details
    const [bloodType, setBloodType] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medication, setMedication] = useState("");
    const [medicalCondition, setMedicalCondition] = useState("");
    const [dnrStatus, setDnrStatus] = useState("");


    const handleDnrStatus = (value: string) => {
        setDnrStatus(value); // Update gender selection
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                setUserId(firebaseUser.uid)
            }
        });

        return () => unsubscribe();
    }, []);




    const handleSubmit = async () => {
        // if (
        //     fullName.trim() === '' ||
        //     icNumber.trim() === '' ||
        //     address.trim() === '' ||
        //     state.trim() === '' ||
        //     postCode.trim() === '' ||
        //     phone.trim() === '' ||
        //     gender.trim() === ''
        // ) {
        //     console.log('Please fill in all fields.');
        //     return;
        // }
        //
        // try {
        //     await setDoc(doc(db, 'users', userId), {
        //             fullName,
        //             icNumber,
        //             address,
        //             state,
        //             postCode,
        //             phone,
        //             gender,
        //             birthday,
        //             init: true
        //         },
        //         { merge : true}
        //     );
        //
        //     console.log('Data saved under user ID:', userId);
        //     router.push("/ChooseProfilePicture");
        // } catch (error) {
        //     console.error('Error uploading data:', error);
        // }
        // router.replace("/Public/home");
    };

    return (
        <View className="flex-1 justify-center" style={{ backgroundColor: theme.background }}>
            <View className="flex-1 justify-center px-4" style={{ backgroundColor: theme.background }}>
                <View className="items-center">
                    <Text className="text-4xl font-bold mb-2" style={{ color: theme.text }}>Enter Medical Records</Text>
                    <TextInput
                        className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                        value={bloodType}
                        onChangeText={setBloodType}
                        placeholder="Blood Type"
                        placeholderTextColor="#888"
                    />

                    <TextInput
                        className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                        value={emergencyContact}
                        onChangeText={setEmergencyContact}
                        placeholder="Emergency Contact"
                        placeholderTextColor="#888"
                    />

                    <TextInput
                        className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                        value={allergies}
                        onChangeText={setAllergies}
                        placeholder="Allergies"
                        placeholderTextColor="#888"
                    />

                    <TextInput
                        className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                        value={medication}
                        onChangeText={setMedication}
                        placeholder="Current Medication"
                        placeholderTextColor="#888"
                    />

                    <TextInput
                        className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                        value={medicalCondition}
                        onChangeText={setMedicalCondition}
                        placeholder="Medical Condition"
                        placeholderTextColor="#888"
                    />

                    <View className="flex-row justify-center items-center">
                        {/* Gender Label */}
                        <Text className="text-l font-bold mr-3" style={{color : theme.text}}>DNR Status:</Text>

                        {/* Male Radio Button */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
                            <View
                                style={{
                                    borderWidth: 1, // Smaller border width
                                    borderColor: "#3498db", // Border color
                                    borderRadius: 50, // To make the border rounded
                                    padding: 2, // Reduced padding to make the button fit smaller
                                    marginRight: 5, // Added space between the radio button and the text
                                }}
                            >
                                <RadioButton
                                    value="Yes"
                                    status={dnrStatus === "Yes" ? "checked" : "unchecked"}
                                    onPress={() => handleDnrStatus("Yes")}
                                    color="#3498db" // Custom color for the checked radio button
                                    uncheckedColor="#3498db" // Color for the unchecked state border
                                />
                            </View>
                            <Text style={{color : theme.text}}>Yes</Text>
                        </View>

                        {/* Female Radio Button */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    borderWidth: 1, // Same smaller border width
                                    borderColor: "#3498db",
                                    borderRadius: 50,
                                    padding: 2, // Smaller padding to match size
                                    marginRight: 5, // Space between radio button and text
                                }}
                            >
                                <RadioButton
                                    value="No"
                                    status={dnrStatus === "No" ? "checked" : "unchecked"}
                                    onPress={() => handleDnrStatus("No")}
                                    color="#3498db"
                                    uncheckedColor="#3498db"
                                />
                            </View>
                            <Text style={{color : theme.text}}>No</Text>
                        </View>
                    </View>


                </View>


                <View className="flex-row justify-center items-center gap-x-4 mt-4">
                    <Pressable onPress={handleSubmit} className="bg-blue-600 px-4 py-2 rounded mt-2">
                        <Text className="text-white font-semibold">Submit</Text>
                    </Pressable>
                    <Pressable onPress={() => {router.replace("/Public/home")}} className="bg-blue-600 px-4 py-2 rounded mt-2">
                        <Text className="text-white font-semibold">Skip</Text>
                    </Pressable>
                </View>

            </View>
        </View>

    );
}
