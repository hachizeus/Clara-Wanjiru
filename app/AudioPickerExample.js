// AudioPickerExample.js

import React from 'react';
import { View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AudioPickerExample = () => {
  const [audioUri, setAudioUri] = React.useState(null);

  const pickAudio = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access audio library is required!");
      return;
    }

    // Launch the audio library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Set to All to include audio files
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAudioUri(result.assets[0].uri); // Adjust the index based on what you want to use
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick an audio" onPress={pickAudio} />
      {audioUri && (
        <Text style={{ marginTop: 20 }}>Selected Audio: {audioUri}</Text>
      )}
    </View>
  );
};

export default AudioPickerExample;
