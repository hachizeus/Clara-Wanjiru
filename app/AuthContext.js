import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth status

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://192.168.1.4:5000/api/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const token = response.data.accessToken;
                const id = response.data.id; // Get user ID from response
                setUserToken(token);
                setUserId(id);
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userId', id.toString());
                setIsAuthenticated(true);
                return { userId: id };
            }
        } catch (error) {
            if (error.response) {
                console.error('Login Error:', error.response.data);

                if (error.response.status === 401) {
                    throw new Error('Invalid email or password.');
                } else if (error.response.status === 404) {
                    throw new Error('Account not found. Please check if the email is registered.');
                }
            } else {
                console.error('Error:', error.message);
            }
            throw new Error('Login failed, please check your credentials.');
        }
    };

    const logout = async () => {
        setUserToken(null);
        setUserId(null);
        setIsAuthenticated(false); // Set authenticated to false
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
    };

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const id = await AsyncStorage.getItem('userId');
            if (token && id) {
                setUserToken(token);
                setUserId(id);
                setIsAuthenticated(true); // User is authenticated
            } else {
                setIsAuthenticated(false); // No token or userId, user is not authenticated
            }
        } catch (error) {
            console.error('Error checking token:', error);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, userId, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
