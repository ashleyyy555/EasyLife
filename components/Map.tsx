import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
// @ts-ignore
import polyline from '@mapbox/polyline'
import CarMarker from "./CarMarker";

const Map = () => {
    const [region, setRegion] = useState<Region | null>(null);
    const [carPosition, setCarPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
    const [routeCoords, setRouteCoords] = useState([]);


    const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

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
            const calculatedCarLatitude = 3.1872776809095846;
            const calculatedCarLongitude = 101.62876346677416;
            const carCoords = {
                latitude: calculatedCarLatitude,
                longitude: calculatedCarLongitude,
            };

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            setCarPosition({
                latitude: calculatedCarLatitude,
                longitude: calculatedCarLongitude,
            });

            // 👇 Call getRoute using these coordinates
            await getRoute({ latitude, longitude }, carCoords);
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
