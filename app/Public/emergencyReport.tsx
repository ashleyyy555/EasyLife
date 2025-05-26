import { View, Text, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import {Region} from "react-native-maps";
import * as Location from "expo-location"; // use your config here
import {PermissionsAndroid, NativeModules } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";


export default function emergencyReport() {
    const { theme } = useTheme();

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");

    const [text, setText] = useState('');

    //Request mic permission for listening
    const requestMicPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
        }
      }
    };

    //Call speech-to-text, (not yet) connect to button
    const { VoskModule } = NativeModules;
    const startVoiceRecognition = () => {
      if (VoskModule && VoskModule.startListening) {
        VoskModule.startListening();
      } else {
        console.warn('VoskModule is not available');
      }
    };

//  This is a Stop-listening function, (yet) connect to button
//     const stopVoiceRecognition = () => {
//       if (VoskModule?.stopListening) {
//         VoskModule.stopListening();
//       }
//     };

    useEffect(() => {
        fetch('https://easylife-express-production.up.railway.app/')  // Replace with your URL
            .then(response => response.text())  // Get response as text
            .then(data => {
                setText(data);
            })
            .catch(err => {
                setText('Error fetching data');
            });
    }, []);

    const sendReportId = async (reportId:number) => {
        try {
            const response = await fetch('https://easylife-express-production.up.railway.app/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Tell server we are sending JSON
                },
                body: JSON.stringify({ reportId }),    // Send the reportId variable
            });

            const data = await response.json();
            console.log('Response from server:', data);
        } catch (error) {
            console.error('Error sending report:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUser(firebaseUser);
                setUserId(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    // Code to get Geolocation

    const [region, setRegion] = useState<Region | null>(null);

    useEffect(() => {
        const getCurrentLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        };

        getCurrentLocation();
    }, []);

    const handleSubmit = async () => {
        if (!user || !region) return;

        try {
            const counterRef = doc(db, "counters", "reportsCounter");

            const reportId = await runTransaction(db, async (transaction) => {
                const counterSnap = await transaction.get(counterRef);
                const current = counterSnap.exists() ? counterSnap.data().current : 0;
                const nextId = current + 1;

                transaction.set(counterRef, { current: nextId }, { merge: true });
                return nextId;
            });

            const reportRef = doc(db, "reports", reportId.toString());

            await setDoc(reportRef, {
                reportId: reportId,
                userId: userId,
                date: new Date().toISOString(),  // Store the date as a string datetime
                location: {
                    latitude: region.latitude,
                    longitude: region.longitude,
                },
                classification: ["police"],
                transcribedText: "Test",  // Default value
                status: "Complete",           // Default value
            });

            sendReportId(reportId);
            console.log("Report submitted with ID:", reportId);

        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };



    return (
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: theme.background }}>
            <Text className="text-xl font-bold mb-2" style={{ color : theme.text }}>Report Emergency</Text>
            <Text className="text-l mb-2" style={{ color : theme.text }}>User Id = {userId} </Text>

            <Text className="text-xl font-bold mb-2" style={{ color : theme.text }}>{text}</Text>

            <Pressable onPress={handleSubmit} className="bg-red-600 px-4 py-2 rounded mt-2">
                <Text className="text-white font-semibold">Submit Report</Text>
            </Pressable>
        </View>
    );
}
