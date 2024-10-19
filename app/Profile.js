import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile({ loggedInEmail, userId }) {
    const [profileImage, setProfileImage] = useState('./assets/me.jpg');
    const [username, setUsername] = useState('Victor Gathecha');
    const [email, setEmail] = useState(loggedInEmail);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            try {
                const savedImage = await AsyncStorage.getItem('profileImage');
                const savedUsername = await AsyncStorage.getItem('username');
                const savedEmail = await AsyncStorage.getItem('email');

                if (savedImage) setProfileImage(savedImage);
                if (savedUsername) setUsername(savedUsername);
                if (savedEmail) setEmail(savedEmail);
            } catch (error) {
                Alert.alert('Error loading user data', error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            await AsyncStorage.setItem('profileImage', result.assets[0].uri);
            await uploadProfilePicture(result.assets[0].uri, userId); // Use actual user ID
        }
    };

    const uploadProfilePicture = async (imageUri, userId) => {
        const formData = new FormData();
        formData.append('profilePicture', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg', // Use a descriptive name
        });
        formData.append('userId', userId); // Send the user ID

        try {
            const response = await fetch('http://192.168.1.7:5000/api/updateProfilePicture', { // Update endpoint
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            Alert.alert(result.message);
        } catch (error) {
            Alert.alert('Error updating profile picture:', error.message);
        }
    };

    const handleSaveDetails = async () => {
        setLoading(true);
        try {
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('email', email);
            Alert.alert('Details saved successfully!');
        } catch (error) {
            Alert.alert('Error saving details', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#753742" style={styles.loader} />;
    }

    return (
        <LinearGradient
            colors={['#753742','#753742']} // Tacos blue and purple gradient
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image 
                            source={{ uri: profileImage || './assets/blankpic.jpg' }} // Fallback to placeholder
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <TextInput 
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput 
                        style={styles.input}
                        value={email}
                        editable={false} // Make the email field read-only
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#00cc99',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: '#00cc99',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
