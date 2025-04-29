// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9fPN3O7bLhEK_9uMTkKQzvGg6foGPOXA",
    authDomain: "easylife-78574.firebaseapp.com",
    projectId: "easylife-78574",
    storageBucket: "easylife-78574.firebasestorage.app",
    messagingSenderId: "315248056224",
    appId: "1:315248056224:web:2727dce94b760d27c1b6c5",
    measurementId: "G-045DN5H50G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });
export const db = getFirestore(app);