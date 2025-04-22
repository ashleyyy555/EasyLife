import { View, Text, TextInput, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig"; // use your config here

export default function NewScreen() {
    const { theme } = useTheme();

    const [user, setUser] = useState(null);
    const [gender, setGender] = useState("");
    const [currentGender, setCurrentGender] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                await fetchGender(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

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

    return (
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: theme.background }}>
            <Text className="text-xl font-bold mb-2" style={{ color: theme.text }}>Emergency Page</Text>
            <Text className="mb-4" style={{ color: theme.text }}>
                Current Gender: <Text className="font-semibold" style={{ color: theme.text }}>{currentGender || "Not set"}</Text>
            </Text>

            <TextInput
                className="h-10 my-3 border px-2.5 text-black bg-white w-full rounded"
                value={gender}
                onChangeText={setGender}
                placeholder="Enter gender"
            />

            <Pressable onPress={handleSubmit} className="bg-blue-600 px-4 py-2 rounded mt-2">
                <Text className="text-white font-semibold">Submit</Text>
            </Pressable>
        </View>
    );
}
