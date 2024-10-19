import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text, ActivityIndicator, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import PropTypes from 'prop-types';

const MediaViewer = ({ route, navigation }) => {
    const { mediaUri, mediaType } = route.params;
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); // State for handling errors

    const handleVideoLoad = () => {
        setLoading(false);
    };

    const handleVideoError = () => {
        setError(true);
        setLoading(false);
    };

    return (
        <Modal
            transparent={false}
            visible={true}
            onRequestClose={() => navigation.goBack()}
        >
            <StatusBar hidden={true} />
            <View style={styles.container}>
                {mediaType === 'video' ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: mediaUri }}
                        style={styles.media}
                        resizeMode="contain"
                        shouldPlay
                        isLooping
                        useNativeControls
                        onReadyForDisplay={handleVideoLoad}
                        onError={handleVideoError} // Handle video load error
                    />
                ) : (
                    <>
                        {loading && !error && <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />}
                        {error ? (
                            <Text style={styles.errorText}>Error loading media</Text>
                        ) : (
                            <Image
                                source={{ uri: mediaUri }}
                                style={styles.media}
                                resizeMode="contain"
                                onLoadEnd={() => setLoading(false)}
                                onError={() => setError(true)} // Handle image load error
                            />
                        )}
                    </>
                )}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton} accessibilityLabel="Close media viewer" disabled={loading}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

// PropTypes for better type checking
MediaViewer.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            mediaUri: PropTypes.string.isRequired,
            mediaType: PropTypes.oneOf(['video', 'image']).isRequired,
        }).isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    loadingIndicator: {
        position: 'absolute',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 18,
        position: 'absolute',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'transparent',
        padding: 10,
    },
    closeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default MediaViewer;
