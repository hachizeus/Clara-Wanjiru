import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Logout() {
    const navigation = useNavigation();

    const handleLogout = () => {
        console.log("Logout button pressed"); // This should show up when the button is pressed
        // If you have authentication data, clear it here
        // For example: AsyncStorage.removeItem('userToken');

        console.log("Navigating to Login"); // Check if this is reached
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Logout</Text>
            <Text style={styles.text}>Are you sure you want to logout?</Text>
            <Button title="Confirm Logout" onPress={handleLogout} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
    },
});
