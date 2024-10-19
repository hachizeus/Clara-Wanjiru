import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';

export default function Settings({ route }) {
    const navigation = useNavigation();
    const { userToken, logout } = useContext(AuthContext);
    const { userId } = route.params;
    const [loading, setLoading] = useState(false);

    const deleteUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://192.168.1.7:5000/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                Alert.alert('Success', 'Your account has been deleted.');
                logout(); // Ensure the user is logged out
                navigation.navigate('Login');
            } else {
                const errorData = await response.json();
                Alert.alert( errorData.message || 'Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Network Error', 'Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: deleteUserData,
                    style: "destructive"
                }
            ]
        );
    };

    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.optionsContainer}>
                {/* Other navigation options */}
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#00cc99" />
            ) : (
                <>
                    <Pressable onPress={handleDeleteAccount} style={styles.deleteAccountButton}>
                        <Text style={styles.deleteAccountText}>Delete Account</Text>
                    </Pressable>
                    <Pressable onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#0e0e0e',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00cc99',
        marginBottom: 24,
    },
    optionsContainer: {
        marginBottom: 16,
    },
    deleteAccountButton: {
        marginTop: 20,
        backgroundColor: '#ff4c4c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteAccountText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: '#00cc99',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
