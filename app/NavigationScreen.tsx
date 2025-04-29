// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import { Platform, StyleSheet, View } from 'react-native';
// import MapView, { PROVIDER_DEFAULT, Region } from 'react-native-maps';
// import * as Location from 'expo-location';
// import {
//     ArrivalEvent,
//     MapViewController,
//     NavigationView,
//     NavigationViewController,
//     useNavigation,
//     NavigationViewCallbacks,
//     MapViewCallbacks
// } from '@googlemaps/react-native-navigation-sdk';
// import {useRoute} from "@react-navigation/native";
//
// const NavigationScreen = () => {
//     const [region, setRegion] = useState<Region | null>(null);
//
//     const route = useRoute();
//     const { termsAndConditionsDialogOptions } = route.params as { termsAndConditionsDialogOptions: { title: string, companyName: string, showOnlyDisclaimer: boolean } };
//     const { navigationController, addListeners, removeListeners } = useNavigation();
//
//     const [mapViewController, setMapViewController] =
//         useState<MapViewController | null>(null);
//     const [navigationViewController, setNavigationViewController] =
//         useState<NavigationViewController | null>(null);
//     const onMapReady = () => {};
//
//     const mapViewCallbacks: MapViewCallbacks = {
//         onMapReady,
//     };
//
//     const onArrival = () => {
//         navigationController?.stopGuidance();
//     };
//
//     useEffect(() => {
//         const getCurrentLocation = async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 console.log('Permission to access location was denied');
//                 return;
//             }
//
//             const location = await Location.getCurrentPositionAsync({
//                 accuracy: Location.Accuracy.High,
//             });
//
//             const { latitude, longitude } = location.coords;
//             setRegion({
//                 latitude,
//                 longitude,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//             });
//         };
//
//         getCurrentLocation();
//     }, []);
//
//     if (!region) {
//         return null; // or a loading spinner
//     }
//
//     const initializeNavigation = useCallback(async () => {
//         try {
//             await navigationController.init();
//             console.log('Navigation initialized');
//         } catch (error) {
//             console.error('Error initializing navigation', error);
//         }
//     }, [navigationController]);
//
//
//
//     const onArrival = useCallback((event: ArrivalEvent) => {
//         if (event.isFinalDestination) {
//             console.log('Final destination reached');
//             navigationController.stopGuidance();
//         } else {
//             console.log('Continuing to the next destination');
//             navigationController.continueToNextDestination();
//             navigationController.startGuidance();
//         }
//     }, [navigationController]);
//
//     const navigationCallbacks = useMemo(() => ({
//         onArrival,
//         // Add other callbacks here
//     }), [onArrival]);
//
//     useEffect(() => {
//         addListeners(navigationCallbacks);
//         return () => {
//             removeListeners(navigationCallbacks);
//         };
//     }, [navigationCallbacks, addListeners, removeListeners]);
//
//
//
//     return (
//         <NavigationView
//             androidStylingOptions={{
//                 primaryDayModeThemeColor: '#34eba8',
//                 headerDistanceValueTextColor: '#76b5c5',
//                 headerInstructionsFirstRowTextSize: '20f',
//             }}
//             iOSStylingOptions={{
//                 navigationHeaderPrimaryBackgroundColor: '#34eba8',
//                 navigationHeaderDistanceValueTextColor: '#76b5c5',
//             }}
//             navigationViewCallbacks={navigationViewCallbacks}
//             mapViewCallbacks={mapViewCallbacks}
//             onMapViewControllerCreated={setMapViewController}
//             onNavigationViewControllerCreated={setNavigationViewController}
//             termsAndConditionsDialogOptions={termsAndConditionsDialogOptions}
//         />
//     );
// };
//
// const styles = StyleSheet.create({
//     map: {
//         width: '100%',
//         height: '50%',
//         borderRadius: 16,
//         overflow: 'hidden',
//     },
// });
//
// export default NavigationScreen;
