import { SafeAreaView , ScrollView ,View, Text, TextInput, Pressable, Image, TouchableOpacity , Modal} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig"; // use your config here
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';

export default function NewScreen() {
    const { theme } = useTheme();

    const [user, setUser] = useState(null);
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [currentGender, setCurrentGender] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openPicturePopup = () => setIsModalVisible(true);
    const closePicturePopup = () => setIsModalVisible(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                await fetchGender(firebaseUser.uid);


                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.fullName);
                    if (userData.profilePicUrl) {
                        // If profilePicUrl exists, set the selectedImage state
                        setSelectedImage(userData.profilePicUrl);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // useEffect for Camera Permissions
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need media permissions to make this work!');
            }

            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
            }
        })();
    }, []);

    // Image Picker Functions
    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            closePicturePopup?.(); // optional if you have a modal
        }
    };


    const takePhotoWithCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            closePicturePopup();
        }
    };

    // Upload Picture to Firebase
    const getBlobFroUri = async (uri: string) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network Error"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })
        return blob;
    }


    const fetchGender = async (uid: string) => {
        try {
            const docRef = doc(db, "users", uid);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                setCurrentGender(data.gender || "");
            }
        } catch (error) {
            console.error("Error fetching gender:", error);
        }
    };

    const handleSubmit = async () => {
        if (!user || gender.trim() === "") return;

        try {
            // @ts-ignore
            await setDoc(doc(db, "users", user.uid), {
                gender: gender.trim(),
            }, { merge: true });

            setCurrentGender(gender.trim());
            setGender("");
        } catch (error) {
            console.error("Error updating gender:", error);
        }
    };

    // @ts-ignore
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView>
                <View className="items-center px-4" style={{ backgroundColor: theme.background }}>
                    <View className="flex-row items-center" style={{ backgroundColor: theme.background }}>
                        <View>
                            <View style={{ position: "relative", marginRight: 20}}>
                                <TouchableOpacity onPress={openPicturePopup}>
                                    <Image
                                        source={
                                            selectedImage
                                                ? { uri: selectedImage }
                                                : require("@/assets/images/lzj.jpeg")
                                        }
                                        style={{ width: 100, height: 100, borderRadius: 150, borderColor: theme.text, borderWidth: 2 }}
                                    />

                                </TouchableOpacity>
                                <TouchableOpacity onPress={openPicturePopup}>
                                    <Ionicons
                                        name="camera-outline"
                                        size={20}
                                        color={theme.text}
                                        style={{
                                            position: 'absolute',
                                            bottom: 7,
                                            right: 0,
                                            backgroundColor: theme.background,
                                            borderRadius: 30,
                                            padding: 5,
                                            borderWidth: 2,
                                            borderColor: theme.text,
                                        }}
                                    />
                                </TouchableOpacity>

                                <Modal
                                    transparent
                                    visible={isModalVisible}
                                    animationType="fade"
                                    onRequestClose={closePicturePopup}
                                >
                                    <Pressable
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        onPress={closePicturePopup} // Close when pressing outside
                                    >
                                        <View className="items-center" style={{
                                            width: 300,
                                            backgroundColor: 'white',
                                            borderRadius: 10,
                                            padding: 20
                                        }}>
                                            <Pressable onPress={() => {pickFromGallery()}}>
                                                <Text style={{ color: 'blue', marginBottom: 10 }}>Pick from Gallery</Text>
                                            </Pressable>
                                            <Pressable onPress={() => {takePhotoWithCamera()}}>
                                                <Text style={{ color: 'blue', marginBottom: 10 }}>Take a Photo</Text>
                                            </Pressable>
                                            <Pressable onPress={() => { console.log("Remove Photo"); closePicturePopup(); }}>
                                                <Text style={{ color: 'blue' }}>Remove Photo</Text>
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                </Modal>
                            </View>
                        </View>
                        <View>
                            <Text className="text-white text-xl font-bold mb-2">
                                {name}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="items-center mt-10">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Weight
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Height
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Address
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Emergency Contact Name
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Emergency Contact Number
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Allergies
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Current Medication
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <View style={{ width: "90%" }}>
                        <Text className="text-white text-xl font-bold mb-1">
                            Medical Condition
                        </Text>

                        <TextInput
                            className="h-10 border text-black bg-white rounded"
                            style={{ width: "100%" }}
                            value={weight}
                            onChangeText={setWeight}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View className="items-center mt-4">
                    <TouchableOpacity className="bg-[#1E88E5] p-4 rounded-lg items-center mt-2" style={{ width: "40%" }}>
                        <Text className="text-white font-bold">Save Changes</Text>
                    </TouchableOpacity>
                </View>

                <View className="items-center mt-4">
                    <TouchableOpacity className="bg-[#CE0303B8] p-4 rounded-lg items-center mt-2" style={{ width: "40%" }}>
                        <Text className="text-white font-bold">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
