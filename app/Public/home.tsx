import { Image, Text, View, SafeAreaView, Pressable, Modal } from "react-native";
import { useColorScheme } from "react-native";
import { useState } from "react";
import {router} from "expo-router";
import "../global.css";
import {useTheme} from "@/context/ThemeContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicalRecordsIcon from "@/components/MedicalRecordsIcon";
import LocationIcon from "@/components/LocationIcon";
import MicIcon from "@/components/MicIcon";


export default function Home() {
    const { theme } = useTheme();
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();

    // Report Model Use State
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const openReportModal = () => setReportModalVisible(true);
    const closeReportModal = () => setReportModalVisible(false);

    // Voice Recognition Model Use State
    const [reportFor, setReportFor] = useState("");
    const [voiceRecognitionModalVisible, setVoiceRecognitionModalVisible] = useState(false);
    const reportForMyself = () => {
        setReportFor("Myself");
        setReportModalVisible(false);
        setVoiceRecognitionModalVisible(true);
    }
    const closeVoiceRecognitionModal = () => setVoiceRecognitionModalVisible(false);




    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
            <View className="justify-center items-center" style={{ paddingTop: insets.top }}>
                {/* Custom Button */}
                <Pressable
                    onPress={openReportModal} // Navigate to new screen
                    className="bg-emergency justify-center items-center"
                    style={{
                        width: 360,
                        height: 154,
                        borderRadius: 54,
                    }}
                >
                    <Text className="text-white text-lg font-bold">EMERGENCY</Text>
                </Pressable>
            </View>
            <View className="flex-row justify-center items-center gap-x-7 mt-4">
                <Pressable
                    onPress={() => router.push("/Public/ProfilePage")} // Navigate to new screen
                    className="bg-medical-records justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <MedicalRecordsIcon size={99}/>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/Public/MapViewer")} // Navigate to new screen
                    className="bg-location justify-center items-center"
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 35,
                    }}
                >
                    <LocationIcon size={99}/>
                </Pressable>
            </View>

            <View className="justify-center items-center mt-4">
                {/* Custom Button */}
                <Pressable
                    onPress={() => router.push("/EnterUserDetails")} // Navigate to new screen
                    className="bg-reports justify-center items-center"
                    style={{
                        width: 360,
                        height: 154,
                        borderRadius: 54,
                    }}
                >
                    <Text className="text-black text-lg font-bold">REPORTS</Text>
                </Pressable>
            </View>

            {/* Report Modal Component */}
            <Modal
                visible={reportModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeReportModal}
            >
                <Pressable
                    onPress={closeReportModal}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={{
                            width: 300,
                            padding: 20,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            alignItems: 'center',
                            elevation: 5,
                        }}
                    >
                        <Text
                            className="text-3xl"
                            style={{
                                fontWeight: 'bold',
                                marginBottom: 10,
                                textAlign: 'center',
                            }}
                        >
                            Who are you reporting for?
                        </Text>
                        <Pressable
                            onPress={reportForMyself}
                            style={{
                                marginTop: 12,
                                minWidth: "60%",
                                padding: 10,
                                backgroundColor: '#1E1E1E',
                                borderRadius: 10,
                            }}
                        >
                            <Text className="text-xl" style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>For myself</Text>
                        </Pressable>

                        <Pressable
                            onPress={closeReportModal}
                            style={{
                                marginTop: 12,
                                minWidth: "60%",
                                padding: 10,
                                backgroundColor: '#1E1E1E',
                                borderRadius: 10,
                            }}
                        >
                            <Text className="text-xl" style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>For others</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Voice Recognition Modal Component */}
            <Modal
                visible={voiceRecognitionModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeVoiceRecognitionModal}
            >
                <Pressable
                    onPress={closeVoiceRecognitionModal}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={{
                            width: 300,
                            padding: 20,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            alignItems: 'center',
                            elevation: 5,
                        }}
                    >
                        <Pressable
                            onPressIn={() => console.log("Holding down")}
                            onPressOut={() => console.log("Released")}
                            style={{
                                marginTop: 12,
                                padding: 10,
                                backgroundColor: '#d3d3d3',
                                borderRadius: 30.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                           <MicIcon />
                        </Pressable>

                        <Text className="text-2xl mt-4" style={{ color: theme.opposite, fontWeight: 'bold', textAlign: 'center' }}>
                            Describe your emergency
                        </Text>

                        <Text className="text-xl" style={{ color: theme.opposite, textAlign: 'center' }}>
                            Hold the icon and speak
                        </Text>

                        <Pressable
                            onPress={closeReportModal}
                            style={{
                                marginTop: 12,
                                minWidth: "60%",
                                padding: 10,
                                backgroundColor: '#E93838',
                                borderRadius: 10,
                            }}
                        >
                            <Text className="text-xl" style={{ color: theme.text, fontWeight: 'bold', textAlign: 'center' }}>Submit Report</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
