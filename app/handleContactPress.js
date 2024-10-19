import React, { useContext, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingAction } from "react-native-floating-action";
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
    dark: {
        background: '#0e0e0e',
        text: '#ffffff',
        header: '#3F51B5',
        switchThumb: '#fff',
    },
    light: {
        background: '#ffffff',
        text: '#000000',
        header: '#3F51B5',
        switchThumb: '#000',
    },
};

export default function HomeScreen() {
    const navigation = useNavigation();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const theme = isDarkMode ? colors.dark : colors.light;

    const requestContactsPermission = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access contacts was denied.');
            return false;
        }
        return true;
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });
            const validContacts = data.filter(contact => contact.phoneNumbers?.length > 0);
            const sortedContacts = validContacts
                .filter(contact => contact.name)
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                .concat(validContacts.filter(contact => !contact.name));

            setContacts(sortedContacts);
            if (sortedContacts.length === 0) {
                Alert.alert('No Contacts', 'No valid contacts found.');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            Alert.alert('Error', 'Failed to fetch contacts. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchContacts();
    };

    useEffect(() => {
        const initialize = async () => {
            const hasPermission = await requestContactsPermission();
            if (hasPermission) {
                await fetchContacts();
                const savedTheme = await AsyncStorage.getItem('isDarkMode');
                setIsDarkMode(savedTheme === 'true');
            }
        };
        initialize();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const handleContactPress = (contact) => {
        navigation.navigate('ChatDetail', { chatId: contact.id, chatName: contact.name });

        // Move selected contact to the top of the list
        const updatedContacts = contacts.filter(c => c.id !== contact.id);
        setContacts([contact, ...updatedContacts]);
    };

    const filteredChats = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderContactItem = ({ item }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContactPress(item)}
            accessibilityLabel={`Chat with ${item.name}`}
            accessibilityHint="Opens the chat with this contact"
        >
            <Text style={styles.contactName}>{item.name || 'Unnamed Contact'}</Text>
            <Text style={styles.contactNumber}>
                {item.phoneNumbers?.[0]?.number || 'No Phone Number'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Chats</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
                        <Icon name="person" size={24} color={theme.switchThumb} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
                        <Icon name="settings" size={24} color={theme.switchThumb} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.themeSwitchContainer}>
                <Text style={{ color: theme.switchThumb }}>Dark Mode</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={() => setIsDarkMode(prev => !prev)}
                    thumbColor={theme.switchThumb}
                />
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search chats..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
            />

            {loading ? (
                <ActivityIndicator size="large" color={theme.header} style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={filteredChats}
                    renderItem={renderContactItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        <View style={styles.noChatsContainer}>
                            <Text style={styles.noChatsText}>No chats available</Text>
                            <TouchableOpacity style={styles.addChatButton} onPress={() => navigation.navigate('NewChat')}>
                                <Text style={styles.addChatText}>Start a New Chat</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            <FloatingAction
                actions={[
                    {
                        text: 'New Chat',
                        icon: <Icon name="message" color="#fff" size={24} />,
                        name: 'bt_new_chat',
                        position: 1,
                    },
                    {
                        text: 'Call',
                        icon: <Icon name="phone" color="#fff" size={24} />,
                        name: 'bt_call',
                        position: 2,
                    },
                ]}
                color={theme.header}
                onPressItem={name => {
                    if (name === 'bt_new_chat') {
                        navigation.navigate('NewChat');
                    } else if (name === 'bt_call') {
                        // Handle call functionality
                    }
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#3F51B5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 10,
    },
    themeSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        fontSize: 16,
        elevation: 5,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    chatList: {
        paddingBottom: 100,
    },
    noChatsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noChatsText: {
        color: '#777',
        fontSize: 16,
        marginBottom: 10,
    },
    addChatButton: {
        backgroundColor: '#3F51B5',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    addChatText: {
        color: '#fff',
        fontSize: 16,
    },
    contactItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contactName: {
        fontSize: 18,
        color: '#000',
    },
    contactNumber: {
        fontSize: 14,
        color: '#666',
    },
});
