import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Switch } from 'react-native';

export default function PrivacySettings() {
    const [locationSharing, setLocationSharing] = React.useState(true);
    const [profileVisibility, setProfileVisibility] = React.useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Privacy Settings</Text>
            <View style={styles.option}>
                <Text style={styles.optionText}>Location Sharing</Text>
                <Switch
                    value={locationSharing}
                    onValueChange={setLocationSharing}
                    thumbColor="#00cc99"
                />
            </View>
            <View style={styles.option}>
                <Text style={styles.optionText}>Profile Visibility</Text>
                <Switch
                    value={profileVisibility}
                    onValueChange={setProfileVisibility}
                    thumbColor="#00cc99"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0e0e0e",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00ffcc',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    optionText: {
        color: '#ddd',
        fontSize: 18,
    },
});
