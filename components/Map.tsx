import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region, Polyline } from 'react-native-maps';
import { onSnapshot, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/FirebaseConfig'; // Adjust based on your Firebase setup
import * as Location from 'expo-location';
import {onAuthStateChanged} from "firebase/auth";
// @ts-ignore
import polyline from '@mapbox/polyline'
import CarMarker from "./CarMarker";

const Map = () => {
    const [userId, setUserId] = useState();
    const [region, setRegion] = useState<Region | null>(null);
    const [carPosition, setCarPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
    const [routeCoords, setRouteCoords] = useState([]);
    const [hasActiveReport, setHasActiveReport] = useState(false);

    const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // @ts-ignore
                setUserId(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ Check Firestore for ongoing report
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, 'reports'),
            where('userId', '==', userId),
            where('status', '==', 'Active')
        );

        const unsubscribe = onSnapshot(
            q,
            async (querySnapshot) => {
                const hasReport = !querySnapshot.empty;
                setHasActiveReport(hasReport);
                console.log('Active report status changed:', hasReport);

                if (hasReport) {
                    const handleRoute = async () => {
                        const calculatedCarLatitude = 3.1872776809095846;
                        const calculatedCarLongitude = 101.62876346677416;
                        const carCoords = {
                            latitude: calculatedCarLatitude,
                            longitude: calculatedCarLongitude,
                        };

                        const location = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.High,
                        });

                        const { latitude, longitude } = location.coords;

                        setCarPosition(carCoords);
                        await getRoute({ latitude, longitude }, carCoords);
                    };

                    handleRoute();
                }
            },
            (error) => {
                console.error('Error listening for ongoing reports:', error);
            }
        );

        return () => unsubscribe();
    }, [userId]);


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

    const getRoute = async (
        start: { latitude: number; longitude: number },
        end: { latitude: number; longitude: number }
    ) => {
        try {
            const origin = `${start.latitude},${start.longitude}`;
            const destination = `${end.latitude},${end.longitude}`;

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();

            if (data.routes.length) {
                const points = polyline.decode(data.routes[0].overview_polyline.points);
                const routePath = points.map(([lat, lng]: [number, number]) => ({
                    latitude: lat,
                    longitude: lng,
                }));
                setRouteCoords(routePath);
            } else {
                console.warn("No route found");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };


    if (!region) {
        return null; // or a loading spinner
    }

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={region}
            showsUserLocation
        >
            <CarMarker
                latitude={carPosition.latitude}
                longitude={
                    carPosition.longitude
                }
            />

            <Polyline
                coordinates={routeCoords}
                strokeColor="red"
                strokeWidth={4}
            />
        </MapView>

    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '80%',
        borderRadius: 16,
        overflow: 'hidden',
    },
});

export default Map;
