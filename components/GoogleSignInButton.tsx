import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

interface GoogleSignInButtonProps {
    onPress: () => void;
    isLoading: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
                                                                          onPress,
                                                                          isLoading
                                                                      }) => {
    return (
        <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.8}
        >
            <View style={styles.buttonContent}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <>
                        <View style={styles.googleIcon}>
                            <Text style={styles.googleIconText}>G</Text>
                        </View>
                        <Text style={styles.buttonText}>Continue with Google</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    googleButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    googleIconText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});