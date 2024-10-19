import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const NewChat = ({ navigation }) => {
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const handleAddContact = () => {
        if (!contactName || !contactNumber) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        
    
        // Here, you would typically save the contact to your backend or state management
        console.log('Contact added:', { name: contactName, number: contactNumber });

        // Clear input fields
        setContactName('');
        setContactNumber('');

        // Navigate back or show a success message
        Alert.alert('Success', 'Contact added successfully!');
        navigation.goBack(); // Go back to the previous screen
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Contact Name"
                value={contactName}
                onChangeText={setContactName}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
            />
            <Button title="Add Contact" onPress={handleAddContact} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    input: {
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default NewChat;
