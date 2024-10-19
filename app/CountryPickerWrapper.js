// CountryPickerWrapper.js
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import countries from './countries'; // Import a list of countries with codes

const CountryPickerWrapper = ({ countryCode, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.countryPickerContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Country"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.cca2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.countryItem}
                        onPress={() => {
                            onSelect(item);
                            setSearchQuery(''); // Clear search on select
                        }}
                    >
                        <Text style={styles.countryText}>{item.name} (+{item.callingCode[0]})</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    countryPickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: 300, // Limit the height of the country picker
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    countryItem: {
        padding: 10,
    },
    countryText: {
        fontSize: 16,
    },
});

export default CountryPickerWrapper;
