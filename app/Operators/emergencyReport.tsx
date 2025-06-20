
import { View, Text, Pressable, Button, Platform, PermissionsAndroid, NativeModules, Alert } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import {Region} from "react-native-maps";
import * as Location from "expo-location"; // use your config here

import { DeviceEventEmitter } from 'react-native';


export default function emergencyReport() {
    const { theme } = useTheme();
    const { VoskModule } = NativeModules;
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    //Request mic permission for listening
    const requestMicPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
          return false;
        }
        return true;
      }
      return true;
    };

    const startVoiceRecognition = async () => {
      const hasPermission = await requestMicPermission();
      if (!hasPermission) return;

      if (VoskModule && VoskModule.startListening) {
        try {
          VoskModule.startListening();
          setIsListening(true);
          console.log('Started listening');
        } catch (error) {
          console.error('Error starting voice recognition:', error);
        }
      } else {
        console.warn('VoskModule is not available');
      }
    };
    
    // where we receives the label and transcription text from android
    const [prediction, setPrediction] = useState('');
    const [transcription, setTranscription] = useState('');
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('onPrediction', (data: { label: string, transcription: string }) => {
            console.log('Predicted category of the case:', data.label);
            console.log('Transcription:', data.transcription);
            setPrediction(data.label);
            setTranscription(data.transcription);
        });

        return () => subscription.remove();
    }, []);
    

    const stopVoiceRecognition = () => {
      if (VoskModule?.stopListening) {
        try {
          VoskModule.stopListening();
          setIsListening(false);
          console.log('Stopped listening');
        } catch (error) {
          console.error('Error stopping voice recognition:', error);
        }
      }
    };

    const showTranscript = async () => {
      try {
        const content = await VoskModule.getTranscript();
        Alert.alert("Transcript", content);
      } catch (err) {
        console.warn("Failed to read transcript:", err);
      }
    };

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
                classification: [prediction || "unknown"], // autio fill in the prediction
                transcribedText: transcription || "N/A",  // autio fill in the transcription
                status: "Complete",           
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

            <Pressable 
                onPressIn={startVoiceRecognition}
                onPressOut={stopVoiceRecognition}
                className="bg-blue-600 px-4 py-2 rounded mt-2 mb-2"
            >
                <Text className="text-white font-semibold">
                    {isListening ? 'Release to Stop' : 'Hold to Record'}
                </Text>
            </Pressable>

            <Button title="Show Transcript" onPress={showTranscript} />

            <Pressable onPress={handleSubmit} className="bg-red-600 px-4 py-2 rounded mt-2">
                <Text className="text-white font-semibold">Submit Report</Text>
            </Pressable>
        </View>
    );
}
