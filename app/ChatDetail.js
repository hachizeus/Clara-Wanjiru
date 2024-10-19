import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    FlatList,
    Image,
    Button,
    imageBackground,

    Modal,
} from 'react-native';
import { ArrowLeft, Paperclip, Send, Camera, XCircle } from "react-native-feather";
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import * as Contacts from 'expo-contacts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import io from 'socket.io-client';

import * as Permissions from 'expo-permissions';



export default function ChatDetail({ setChatList = () => { } }) {
    const route = useRoute();
    const navigation = useNavigation();
    const { chatId, chatName, contactName, isDarkMode } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const flatListRef = useRef(null);
    const [mediaType, setMediaType] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false); // New state for media preview
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contacts, setContacts] = useState([{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]); // Example contacts
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
    const [recording, setRecording] = useState(false);
    const [recordingPath, setRecordingPath] = useState(null);

   const requestMicrophonePermission = async () => {
    const status = await request(PERMISSIONS.ANDROID.RECORD_AUDIO); // For Android, use PERMISSIONS.IOS.MICROPHONE for iOS
    if (status !== RESULTS.GRANTED) {
        Alert.alert('Microphone permission is required to record audio.');
    } else {
        // Microphone permission is granted
    }
};

    // Start audio recording
    const onStartRecord = async () => {
        try {
            const uri = await audioRecorderPlayer.startRecorder();
            setRecording(true);
            setRecordingPath(uri);  // Save the recording path if needed
            console.log(`Recording started at: ${uri}`);
        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    // Stop recording function
    const onStopRecord = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setRecording(false);
            console.log(`Recording stopped: ${result}`);
            // You can handle the recorded audio file here, e.g., save it or play it back
        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Error', 'Failed to stop recording');
        }
    };

    useEffect(() => {
        requestMicrophonePermission(); // Request permission on component mount

        const loadMessages = async () => {
            if (chatId) {
                try {
                    const storedMessages = await AsyncStorage.getItem(chatId);
                    if (storedMessages) {
                        setMessages(JSON.parse(storedMessages));
                    }
                } catch (error) {
                    console.error('Failed to load messages:', error);
                    Alert.alert('Error', 'Could not load messages.');
                } finally {
                    setLoadingMessages(false);
                }
            }
        };

        loadMessages();
    }, [chatId]);

    

    const handleForwardMessage = () => {
        setIsModalVisible(true); // Open the contact selection modal
    };

    // Function to fetch contacts
    const fetchContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });
            if (data.length > 0) {
                setContacts(data);
            }
        } else {
            Alert.alert('Permission to access contacts was denied');
        }
    };

    const handleContactSelect = (contact) => {
        Alert.alert("Forwarding", `Forwarding message: "${selectedMessage.text}" to ${contact.name}`);
        setSelectedContact(contact);
        setIsModalVisible(false);
        setSelectedMessage(null);
    };

    // Fetch contacts when the modal is opened
    useEffect(() => {
        if (isModalVisible) {
            fetchContacts();
        }
    }, [isModalVisible]);



    const navigateToChatInfo = () => {
        navigation.navigate('ChatInfo', { chatId, chatName });
    };

    useEffect(() => {
        const loadMessages = async () => {
            if (chatId) {
                try {
                    const storedMessages = await AsyncStorage.getItem(chatId);
                    if (storedMessages) {
                        setMessages(JSON.parse(storedMessages));
                    }
                } catch (error) {
                    console.error("Failed to load messages:", error);
                    Alert.alert("Error", "Could not load messages.");
                } finally {
                    setLoadingMessages(false);
                }
            }
        };

        loadMessages();
    }, [chatId]);

    const handleCamera = () => {
        Alert.alert("Choose Media Type", "Would you like to take a photo or record a video?", [
            { text: "Photo", onPress: handleTakePhoto },
            { text: "Video", onPress: handleRecordVideo },
            

            { text: "Cancel", style: "cancel" },
        ]);
    };
    // Audio recording handler
    const handleRecordAudio = async () => {
        try {
            console.log('Recording audio...');
            const result = await audioRecorderPlayer.startRecorder();
            console.log('Audio recorded at:', result);
        } catch (err) {
            console.log('Audio recording error:', err);
        }
    };

    // Audio picking handler
    const handlePickAudio = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });
            console.log('Audio selected:', result);
            // You can now handle the picked audio here
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Audio pick canceled');
            } else {
                throw err;
            }
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('Document selected:', result);
            // You can now handle the picked document here
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Document pick canceled');
            } else {
                throw err;
            }
        }
    };

    const handleTakePhoto = async () => {
        const cameraResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
            allowsEditing: true,
            quality: 1,
        });

        if (!cameraResult.canceled) {
            const selectedAsset = cameraResult.assets[0];
            setSelectedMedia(selectedAsset);
            setMediaType('image');
            setShowPreview(true);
        }
    };
    const handleRecordVideo = async () => {
        try {
            const videoResult = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Allow only videos
                allowsEditing: true,
                quality: 1,
            });

            // Check if videoResult has the expected structure
            if (videoResult && !videoResult.canceled) {
                const selectedAsset = videoResult.assets ? videoResult.assets[0] : null;
                if (selectedAsset) {
                    setSelectedMedia(selectedAsset);
                    setMediaType('video');
                    setShowPreview(true);
                }
            }
        } catch (error) {
            console.error("Error recording video:", error);
        }
    };




    const sendMessage = async () => {
        if (newMessage.trim() || selectedMedia) {
            setIsSending(true);
            const messageToSend = {
                id: Date.now(),
                text: newMessage.trim(),
                sender: 'me',
                chatId,
                media: selectedMedia ? [{ uri: selectedMedia.uri, type: mediaType }] : [],
            };

            const updatedMessages = [...messages, messageToSend];
            setMessages(updatedMessages);
            setNewMessage('');
            setSelectedMedia(null);
            setMediaType(null);

            try {
                await AsyncStorage.setItem(chatId, JSON.stringify(updatedMessages));
                flatListRef.current.scrollToEnd({ animated: true });
            } catch (error) {
                console.error("Failed to save messages:", error);
                Alert.alert("Error", "Could not send the message.");
            } finally {
                setIsSending(false);
                setShowPreview(false);
            }
        } else {
            Alert.alert("Error", "Please type a message or select a media to send.");
        }
    };


    const handleCancelPreview = () => {
        setSelectedMedia(null);
        setMediaType(null);
        setShowPreview(false);
    };

    const handleMediaPicker = () => {
        Alert.alert("Select Media Type", "Choose a type of media to send", [
            { text: "Photo", onPress: handleImagePicker },
            { text: "Video", onPress: handleVideoPicker },
            { text: "Doc", onPress: handlePickDocument },
            { text: "Cancel", style: "cancel" },
        ]);
    };


    const handleImagePicker = async () => {
        const imageResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!imageResult.canceled) {
            setSelectedMedia(imageResult.assets[0]);
            setMediaType('image');
            setShowPreview(true);
        }
    };

    const handleVideoPicker = async () => {
        const videoResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });
        if (!videoResult.canceled) {
            setSelectedMedia(videoResult.assets[0]);
            setMediaType('video');
            setShowPreview(true);
        }
    };

    const handleLongPress = (message) => {
        setSelectedMessage(message);
    };

    const handleDeleteMessage = async () => {
        const updatedMessages = messages.filter(msg => msg.id !== selectedMessage.id);
        setMessages(updatedMessages);
        await AsyncStorage.setItem(chatId, JSON.stringify(updatedMessages));
        setSelectedMessage(null); // Reset the selected message
    };

    const handleCopyMessage = () => {
        if (selectedMessage) {
            let messageContent = selectedMessage.text || '';

            // If there's media, append it to the message content
            if (selectedMessage.media && selectedMessage.media.length > 0) {
                // Assuming media is an array of objects with a 'uri' property
                const mediaLinks = selectedMessage.media.map(mediaItem => mediaItem.uri).join('\n');
                messageContent += `\nMedia:\n${mediaLinks}`;
            }

            // Copy the combined message content to the clipboard
            Clipboard.setString(messageContent);
            Alert.alert("Message Copied", messageContent);
            setSelectedMessage(null); // Reset the selected message
        } else {
            Alert.alert("No message selected", "Please select a message to copy.");
        }
    };



    const renderMessage = useCallback(({ item }) => (
        <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
                {item.media && item.media.map((mediaItem, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate('MediaViewer', { mediaUri: mediaItem.uri, mediaType: mediaItem.type })}
                    >
                        {mediaItem.type === 'video' ? (
                            <Video source={{ uri: mediaItem.uri }} style={styles.media} resizeMode="contain" shouldPlay={false} />
                        ) : (
                            <Image source={{ uri: mediaItem.uri }} style={styles.media} />
                        )}
                    </TouchableOpacity>
                ))}
                <Text style={[styles.messageText, { color: item.sender === 'me' ? '#fff' : '#000' }]}>{item.text}</Text>
            </View>
        </TouchableOpacity>
    ), [messages, navigation]);

    return (

        <SafeAreaView style={[styles.safeArea, styles.container]} >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={isDarkMode ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Image source={{ uri: 'http://192.168.1.4:5000/api/updateProfilePicture' }} style={styles.profileImage} />
                    <Text style={[styles.chatName, { color: isDarkMode ? '#fff' : '#000' }]}>{contactName || chatName}</Text>

                    {/* Voice Icon */}
                    <TouchableOpacity onPress={() => console.log('Phone pressed')} style={styles.iconButton}>
                        <Icon name="phone" size={24} color={isDarkMode ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    {/* Video Icon */}
                    <TouchableOpacity onPress={() => console.log('Video pressed')} style={styles.iconButton}>
                        <Icon name="videocam" size={24} color={isDarkMode ? '#fff' : '#000'} />
                    </TouchableOpacity>
                     
                    <TouchableOpacity onPress={navigateToChatInfo}><Icon name="info" size={24} color={isDarkMode ? "#fff" : "#000"} />
                    </TouchableOpacity>
                </View>
            

            {loadingMessages ? (
                <ActivityIndicator size="large" color="#007aff" style={styles.loadingIndicator} />
            ) : messages.length === 0 ? (
                <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.chatContainer}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                />
            )}

            {showPreview && (
                <Modal transparent={true} animationType="slide">
                    <View style={styles.previewContainer}>
                        {mediaType === 'image' && (
                            <Image source={{ uri: selectedMedia.uri }} style={styles.previewMedia} />
                        )}
                        {mediaType === 'video' && (
                            <Video source={{ uri: selectedMedia.uri }} style={styles.previewMedia} resizeMode="contain" shouldPlay />
                        )}
                        <View style={styles.previewActions}>
                            <TouchableOpacity onPress={handleCancelPreview} >
                                <XCircle color="#ff0000" />
                                <Text style={styles.cancelText}></Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sendMessage} >
                                <Send color="#007aff" />
                                <Text style={styles.sendText}></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={handleTakePhoto} style={styles.optionButton}>
                            <Text style={styles.optionText}>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRecordVideo} style={styles.optionButton}>
                            <Text style={styles.optionText}>Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={handleMediaPicker} style={styles.attachmentButton}>
                        <Paperclip color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
                        <Camera color="#000" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        multiline // Enable multiline input
                        textAlignVertical="top" // Ensure text starts at the top
                        numberOfLines={4}

                    // Optional: Set a maximum number of visible lines
                    />
                    <TouchableOpacity onPress={recording ? onStopRecord : onStartRecord} style={styles.recordButton}>
                            <Icon name={recording ? "stop" : "mic"} size={24} color={isDarkMode ? "#fff" : "#000"} />
                        </TouchableOpacity>
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={isSending}>
                        {isSending ? <ActivityIndicator color="#fff" /> : <Send color="#000" />}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
            {selectedMessage && (
                <View style={styles.messageOptions}>
                    <TouchableOpacity onPress={handleDeleteMessage} style={styles.optionButton}>
                        <Text style={styles.optionText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopyMessage} style={styles.optionButton}>
                        <Text style={styles.optionText}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForwardMessage} style={styles.optionButton}>
                        <Text style={styles.optionText}>Forward</Text>
                    </TouchableOpacity>
                    <Modal visible={isModalVisible} transparent={true} animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 20 }}>
                                <Text>Select a Contact</Text>
                                <FlatList
                                    data={contacts}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleContactSelect(item)}>
                                            <Text style={{ padding: 10 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <Button title="Close" onPress={() => setIsModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#753742',
    },
    backButton: {
        marginRight: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconButton: {
        marginLeft: 20, // Adjust as needed
    },

    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    noMessagesText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
    },
    chatContainer: {
        padding: 10,
        
    },
    messageBubble: {
        marginBottom: 5,
        padding: 5,
        borderRadius: 10,
        maxWidth: 250,
    },
    myMessage: {
        backgroundColor: '#000',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    media: {
        width: 200,
        height: 150,
        marginBottom: 0,
        borderRadius: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        width:350,
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#753742',
        marginLeft:5,
        marginBottom:5,
        borderRadius:25,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        marginHorizontal: 5,
    },
    sendButton: {

        padding: 10,
        borderRadius: 20,
    },
    attachmentButton: {
        padding: 10,
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    previewMedia: {
        width: 300,
        height: 450,
        marginBottom: 20,
    },
    previewActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingVertical: 10,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,

        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    sendPreviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,

        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    sendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,

    },
    messageOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        elevation: 5, // Adds shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 3, // Shadow blur radius
    },
    optionButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007aff', // Button background color
        marginHorizontal: 5, // Space between buttons
    },
    optionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 10,
        borderRadius: 50,
      },
});