import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleForgotPassword = () => {
    if (!phoneNumber) {
      Alert.alert('Please enter your phone number.');
      return;
    }

    setLoading(true);

    // Simulate sending a verification code without Firebase
    setTimeout(() => {
      Alert.alert('Success', 'Verification code sent to your phone number. Please check your messages.');
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f2f2f2' },
  title: { fontSize: 28, marginBottom: 24, textAlign: 'center', color: '#333' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 16 },
  button: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default ForgotPassword;
