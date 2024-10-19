import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSettings() {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId } = route.params || {}; // Get the chatId from route parameters

    // Load user data on mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // You can add logic here to load other user settings if needed
            } catch (error) {
                console.error('Error loading user data', error);
            }
        };

        loadUserData();
    }, []);

    // Function to open the image picker
    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (result.canceled) return; // Return early if the user cancels

        // Navigate back to ChatDetail with the selected image if needed
        navigation.navigate('ChatDetail', {
            chatId: chatId, // Ensure 'contact.id' is defined and accessible
            chatName: 'Chat Name', // Pass any additional required params
            chatProfilePicture: 'Profile Picture URI',
            contactName: 'Contact Name',
            isDarkMode: false, // Adjust based on your app's logic
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profile Settings</Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={handleImagePicker}>
                    <Text style={styles.optionText}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    optionsContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        marginBottom: 16,
    },
    optionText: {
        fontSize: 18,
    },
});
