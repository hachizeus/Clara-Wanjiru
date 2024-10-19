import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ChatInfo = () => {
  const route = useRoute();
  const { chatId, chatName, media} = route.params;

  const chatData = {
    id: chatId,
    name: chatName,
    phone: '1', 
    profilePicture: 'http://192.168.1.7:5000/api/updateProfilePicture',
  };

  const renderMediaItem = ({ item }) => (
    <View style={styles.mediaItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.mediaImage}
        onError={() => {
          console.warn(`Failed to load image: ${item.uri}`);
        }}
        onLoadEnd={(e) => {
          if (e.nativeEvent.error) {
            // Optionally display a placeholder image here
            console.log(`Error loading image: ${item.uri}`);
          }
        }}
      />
    </View>
  );

  const handleMuteNotifications = () => {
    Alert.alert('Notifications Muted', 'You have muted notifications for this chat.');
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Logic to clear chat goes here
            console.log('Chat cleared');
            // You may also want to update state or notify the backend
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBlockContact = () => {
    Alert.alert('Contact Blocked', 'You have blocked this contact.');
    // Add logic to block the contact here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: chatData.profilePicture }} style={styles.profilePicture} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{chatData.name}</Text>
          <Text style={styles.phone}>{chatData.phone}</Text>
        </View>
      </View>

      <FlatList
        data={media}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        style={styles.mediaList}
        initialNumToRender={10} // Optimize rendering if needed
      />

      <TouchableOpacity style={styles.option} onPress={handleMuteNotifications}>
        <Text style={styles.optionText}>Mute Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleClearChat}>
        <Text style={styles.optionText}>Clear Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleBlockContact}>
        <Text style={styles.optionText}>Block Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#753742',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#753742',
    boxShadow: '#000',
    boxShadow: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: 'gray',
  },
  mediaList: {
    marginBottom: 20,
  },
  mediaItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  mediaImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default ChatInfo;
