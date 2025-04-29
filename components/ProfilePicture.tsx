import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon library you're using

type ProfilePictureProps = {
    imageUri: string | null;
    onPressCamera: () => void;
};

const ProfilePicture = ({ imageUri, onPressCamera }: ProfilePictureProps) => {
    return (
        <View style={styles.container}>
            <Image
                source={
                    imageUri
                        ? { uri: imageUri }
                        : require('@/assets/images/lzj.jpeg') // fallback/default image
                }
                style={styles.image}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={onPressCamera}>
                <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const SIZE = 120;

const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#ccc',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#3498db',
        borderRadius: 16,
        padding: 4,
    },
});

export default ProfilePicture;
