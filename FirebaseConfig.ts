// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
    appId: "1:315248056224:web:2ea6afd9ad645a93c1b6c5",
    measurementId: "G-Y2VX76ST8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });