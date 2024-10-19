import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.4:5000/api/signup';

const SignUp = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        countryCode: '+254',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMessages(prev => ({ ...prev, [name]: '' }));
    };

    const validateInputs = () => {
        const { firstName, lastName, email, mobile, password } = formData;
        const errors = {};

        if (!firstName) errors.firstName = 'First Name is required';
        if (!lastName) errors.lastName = 'Last Name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Invalid email address';
        }
        if (!mobile || mobile.length < 10) {
            errors.mobile = 'Invalid mobile number';
        }
        if (!password) errors.password = 'Password is required';

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        try {
            const response = await axios.post(API_URL, formData);
            if (response.status === 200) {
                Alert.alert('Success', 'User registered successfully');
                navigation.navigate('Login');
            } else {
                Alert.alert(response.data.message || 'Sign Up failed');
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#000000', '#B00020']} style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            {['firstName', 'lastName'].map((field, index) => (
                <View key={index} style={styles.inputContainer}>
                    <MaterialIcons name={field === 'firstName' ? 'person' : 'person'} size={24} color="#FFFFFF" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field]}
                        onChangeText={(value) => handleInputChange(field, value)}
                        editable={!loading}
                        accessibilityLabel={`${field.charAt(0).toUpperCase() + field.slice(1)} Input`}
                        accessibilityHint={`Enter your ${field}`}
                    />
                    {errorMessages[field] && <Text style={styles.error}>{errorMessages[field]}</Text>}
                </View>
            ))}

            <View style={styles.phoneContainer}>
                <TextInput
                    style={styles.countryCodeInput}
                    value={formData.countryCode}
                    onChangeText={(value) => handleInputChange('countryCode', value)}
                    editable={!loading}
                    accessibilityLabel="Country Code Input"
                    placeholder="Country Code"
                />
                <TextInput
                    style={styles.mobileInput}
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChangeText={(value) => handleInputChange('mobile', value)}
                    editable={!loading}
                    accessibilityLabel="Mobile Input"
                />
                {errorMessages.mobile && <Text style={styles.error}>{errorMessages.mobile}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#FFFFFF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    editable={!loading}
                    accessibilityLabel="Email Input"
                />
                {errorMessages.email && <Text style={styles.error}>{errorMessages.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#FFFFFF" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    editable={!loading}
                    secureTextEntry
                    accessibilityLabel="Password Input"
                />
                {errorMessages.password && <Text style={styles.error}>{errorMessages.password}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>
                    Already have an account? Login
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
    phoneContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    countryCodeInput: {
        height: 50,
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#3D3D3D',
        borderRadius: 8,
        color: 'white',
        marginRight: 10,
    },
    mobileInput: {
        height: 50,
        flex: 2,
        paddingHorizontal: 10,
        backgroundColor: '#3D3D3D',
        borderRadius: 8,
        color: 'white',
    },
    error: {
        color: '#FF1744',
        fontSize: 12,
        marginTop: 5,
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
    loginLink: {
        marginTop: 20,
        textAlign: 'center',
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default SignUp;
