import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';

export default function SelectContact({ route }) {
    const { onSelect } = route.params; // Function to handle the selected contact
    const [contacts, setContacts] = useState([]); // State to hold contacts

    useEffect(() => {
        const fetchContacts = async () => {
            const permission = await Contacts.requestPermission(); // Request permission to access contacts
            if (permission === 'authorized') {
                const fetchedContacts = await Contacts.getAll(); // Fetch contacts from device
                setContacts(fetchedContacts); // Update state with fetched contacts
            }
        };

        fetchContacts(); // Call the function to fetch contacts
    }, []);

    const renderContact = ({ item }) => (
        <TouchableOpacity onPress={() => onSelect({ name: item.displayName })} style={styles.contactItem}>
            <Text style={styles.contactName}>{item.displayName}</Text> {/* Display contact name */}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts} // Data to be displayed in the list
                renderItem={renderContact} // Render function for each contact
                keyExtractor={item => item.recordID} // Unique key for each item
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    contactItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', // Styling for contact items
    },
    contactName: {
        fontSize: 18, // Font size for contact names
    },
});
