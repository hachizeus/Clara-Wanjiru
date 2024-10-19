import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.4:5000/api/login';

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(API_URL, { email, password });
            if (response.status === 200) {
                Alert.alert('Success', 'Login successful!');
                navigation.navigate('Home'); // Adjust according to your Home screen
            } else {
                Alert.alert('Error', response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#000000', '#B00020']} style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#FFFFFF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                    accessibilityLabel="Email Input"
                />
            </View>
            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#FFFFFF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                    secureTextEntry
                    accessibilityLabel="Password Input"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Login'}</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}>
                    Don't have an account? Sign Up
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#3D3D3D',
        padding: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#3D3D3D',
        borderRadius: 8,
        color: 'white',
    },
    button: {
        backgroundColor: '#B00020',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    spinner: {
        marginTop: 10,
    },
    signupLink: {
        marginTop: 20,
        textAlign: 'center',
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default Login;
