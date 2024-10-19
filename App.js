import React, { useState, useEffect } from 'react'; // Added useEffect here
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileProvider } from './app/ProfileContext'; // Ensure this import is correct
import { AuthProvider } from './app/AuthContext';
import { ChatProvider } from './app/ChatContext';

import HomeScreen from './app/HomeScreen'; // Make sure to import HomeScreen
import Profile from './app/Profile';
import Settings from './app/Settings';
import ProfileSettings from './app/ProfileSettings';
import NotificationPreferences from './app/NotificationPreferences';
import PrivacySettings from './app/PrivacySettings';
import AccountManagement from './app/AccountManagement';
import WelcomeScreen from './app/WelcomeScreen';
import ChatDetail from './app/ChatDetail';
import NewChat from './app/NewChat';
import SelectContact from './app/SelectContact';
import SignUp from './app/SignUp';
import Login from './app/Login';
import ForgotPassword from './app/ForgotPassword';
import ChatInfo from './app/ChatInfo';
import MediaViewer from './app/MediaViewer';
import AudioPickerExample from './app/AudioPickerExample';

const Stack = createStackNavigator();

export default function App() {
    const [chatList, setChatList] = useState([]); // Initialize chatList state here
    const [isLoading, setIsLoading] = useState(true); // Initialize isLoading state here

    
    return (
        <AuthProvider>
            <ChatProvider>
                <ProfileProvider>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="WelcomeScreen">
                            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                            <Stack.Screen name="AudioPickerExample" component={AudioPickerExample} options={{ headerShown: false }} />
                            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ChatInfo" component={ChatInfo} options={{ headerShown: false }} />
                            <Stack.Screen name="MediaViewer" component={MediaViewer} options={{ headerShown: false }} />
                            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                            <Stack.Screen name="ProfileSettings" component={ProfileSettings} options={{ headerShown: false }} />
                            <Stack.Screen name="NotificationPreferences" component={NotificationPreferences} options={{ headerShown: false }} />
                            <Stack.Screen name="PrivacySettings" component={PrivacySettings} options={{ headerShown: false }} />
                            <Stack.Screen name="AccountManagement" component={AccountManagement} options={{ headerShown: false }} />
                            <Stack.Screen name="NewChat" component={NewChat} options={{ headerShown: false }} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                            <Stack.Screen name="ChatDetail" options={{ headerShown: false }}>
                                {props => <ChatDetail {...props} setChatList={setChatList} chatList={chatList} />}
                            </Stack.Screen>
                        </Stack.Navigator>
                    </NavigationContainer>
                </ProfileProvider>
            </ChatProvider>
        </AuthProvider>
    );
}
