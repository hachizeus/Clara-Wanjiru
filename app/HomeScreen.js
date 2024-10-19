import React, { useContext, useState, useEffect, memo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingAction } from "react-native-floating-action";
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import blankPic from './assets/blankpic.jpg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

const colors = {
    dark: {
        background: '#000000', // black
        text: '#FFFFFF', // white
        header: '#753742', // red
    },
    light: {
        background: '#FFFFFF', // white
        text: '#000000', // black
        header: '#753742', // red
    },
};

const ContactItem = memo(({ item, onPress, profileImage, onProfilePress }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
        <TouchableOpacity onPress={onProfilePress}>
            <Image
                source={typeof profileImage === 'string' ? { uri: profileImage } : profileImage}
                style={styles.avatar}
                onError={() => console.log("Error loading image")}
            />
        </TouchableOpacity>
        <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name || 'Unnamed Contact'}</Text>
            <Text style={styles.contactMessage}>{item.lastMessage || "No messages"}</Text>
        </View>
        <Text style={styles.chatTime}>{item.lastMessageTime || "12:34 PM"}</Text>
    </TouchableOpacity>
));

const HomeScreen = () => {
    const navigation = useNavigation();
    const { userProfile, userId } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [recentChats, setRecentChats] = useState([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const theme = isDarkMode ? colors.dark : colors.light;

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
                });
                const validContacts = data.filter(contact => contact.phoneNumbers?.length > 0);
                const sortedContacts = validContacts
                    .filter(contact => contact.name)
                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    .concat(validContacts.filter(contact => !contact.name));

                setContacts(sortedContacts);
            } else {
                console.error('Permission to access contacts was denied');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchContacts();
            const savedTheme = await AsyncStorage.getItem('isDarkMode');
            setIsDarkMode(savedTheme === 'true');
            await loadFonts();
        };
        initialize();
    }, []);

    const loadFonts = async () => {
        await Font.loadAsync({
            'Poppins-Bold': require('./assets/me.jpg'),
        });
        setFontsLoaded(true);
    };

    useEffect(() => {
        AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const handleContactPress = (contact) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time
    
        setRecentChats((prevRecentChats) => {
            const updatedRecentChats = prevRecentChats.filter(c => c.id !== contact.id);
            const newChat = { 
                ...contact, 
                lastMessage: "...", 
                lastMessageTime: currentTime // Set the last message time to the current time
            };
    
            return [newChat, ...updatedRecentChats];
        });
    
        navigation.navigate('ChatDetail', { 
            chatId: contact.id, 
            chatName: contact.name, 
            contact: contact.phoneNumbers 
        });
    };
    

    const handleProfilePress = (profileImage) => {
        setSelectedImage(profileImage);
        setImageModalVisible(true);
    };

    const filteredContacts = contacts.filter(contact => {
        const lowerCaseSearchText = searchText.toLowerCase();
        return (
            contact.name.toLowerCase().includes(lowerCaseSearchText) ||
            contact.phoneNumbers?.some(phone => phone.number.includes(lowerCaseSearchText))
        );
    });
    
    const combinedContacts = [...recentChats, ...filteredContacts].filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.id === item.id || (t.name === item.name && t.phoneNumbers[0]?.number === item.phoneNumbers[0]?.number)
        ))
    );
    

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={theme.header} />;
    }

    return (
        <LinearGradient
            colors={['#753742','#753742']}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.header} />

                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.header }]}>
                    <Text style={[styles.title, { color: theme.text }]}>Motalk</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
                            <Icon name="person" size={28} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings', { userId })} style={styles.iconButton}>
                            <Icon name="settings" size={28} color={'white'} />
                        </TouchableOpacity>
                    </View>
                </View>

               
<TextInput
    style={styles.searchInput}
    placeholder="Search Contacts"
    placeholderTextColor="#bbb"
    value={searchText}
    onChangeText={(text) => setSearchText(text)}
    returnKeyType="search"
    onSubmitEditing={() => {
        
        console.log('Search submitted for:', searchText);
    }}
/>


{loading ? (
    <ActivityIndicator size="large" color={theme.header} />
) : (
    <FlatList
        data={combinedContacts}
        renderItem={({ item }) => (
            <ContactItem
                item={item}
                onPress={() => handleContactPress(item)}
                onProfilePress={() => handleProfilePress(item.profileImage || blankPic)}
                profileImage={
                    item.profileImage || userProfile?.[item.id]?.profilePicture || blankPic
                }
            />
        )}
        keyExtractor={(item, index) => {
            return item.id 
                ? item.id.toString() 
                : `${item.name}-${item.phoneNumbers[0]?.number || Math.random()}-${index}`;
        }}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
    />
)}

                {/* Floating Action Button */}
                <FloatingAction
                    actions={[
                        {
                            text: 'New Message',
                            icon: <Icon name="message" color="#fff" size={24} />,
                            name: 'bt_new_chat',
                            position: 1,
                        },
                    ]}
                    color={theme.header}
                    onPressItem={name => {
                        if (name === 'bt_new_chat') {
                            navigation.navigate('NewChat');
                        }
                    }}
                />

                {/* Image Preview Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={imageModalVisible}
                    onRequestClose={() => setImageModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Image
                            source={typeof selectedImage === 'string' ? { uri: selectedImage } : selectedImage}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                        <Pressable style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#753742', // Added background for overall consistency
    },
    gradientContainer: {
        flex: 1,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#753742', // Make header stand out
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF', // Subtle contrast with the header
    },
    title: {
        fontSize: 28, // Slightly reduced for balance
        fontFamily: 'Poppins-Bold',
        fontWeight: '800',
        color: '#FFFFFF',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
        padding: 5, // Added padding for better touch feedback
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10, // Softer rounded corners
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#C8102E',
        color: '#000000',
        fontSize: 16,
    },
    chatList: {
        paddingBottom: 80, // Increased padding for better spacing at the bottom
    },
    contactItem: {
        flexDirection: 'row',
        paddingVertical: 12, // More vertical space for visual balance
        paddingHorizontal: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C8102E',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    contactDetails: {
        flex: 1,
        marginLeft: 12, // Slightly more space between avatar and details
    },
    contactName: {
        fontSize: 16,
        fontWeight: '700', // Reduced font weight for better readability
        color: '#fff',
    },
    contactMessage: {
        fontSize: 14,
        color: '#c0c0c0',
    },
    chatTime: {
        fontSize: 12,
        color: '#c0c0c0',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay for better focus
    },
    fullImage: {
        width: '90%',
        height: '90%',
        borderRadius: 10, // Softer rounded edges for the image
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20, // Added horizontal padding for better button size
        backgroundColor: '#C8102E',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16, // Increased font size for better legibility
    },
});

export default HomeScreen;
