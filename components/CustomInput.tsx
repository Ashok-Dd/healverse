import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

interface CustomInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric';
}

export const CustomInput: React.FC<CustomInputProps> = ({
                                                            label,
                                                            value,
                                                            onChangeText,
                                                            placeholder,
                                                            keyboardType = 'default'
                                                        }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#111827',
    },
});