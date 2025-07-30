import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { validateUserForm } from '@/lib/validations';
import Button from "@/components/Button";
import {useAuthStore} from "@/store/authStore";
import {router} from "expo-router";

interface UserFormData {
    username: string;
    age: string;
}

const Login: React.FC = () => {

    const {login , isLoading , error} = useAuthStore();

    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        age: '',
    });


    const updateFormData = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };



    const handleLogin = async () => {
        try {
            // Validate form
            const validationError = validateUserForm(formData.username, formData.age);
            if (validationError) {
                Alert.alert('Validation Error', validationError);
                return;
            }

            await login({
                username: formData.username,
                password: formData.username + formData.age // Confirm this logic
            });

            router.push("/(root)/(tabs)/tracker" as any);
        } catch (e) {
            console.log(e);
            Alert.alert('Login Failed', error || 'Please check your credentials and try again.');
        }
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Please enter your details to continue</Text>

                    <View style={styles.form}>
                        <CustomInput
                            label="Username"
                            value={formData.username}
                            onChangeText={(text) => updateFormData('username', text)}
                            placeholder="Enter your username"
                        />

                        <CustomInput
                            label="Age"
                            value={formData.age}
                            onChangeText={(text) => updateFormData('age', text)}
                            placeholder="Enter your age"
                            keyboardType="numeric"
                        />

                        {/*<GoogleSignInButton*/}
                        {/*    onPress={handleGoogleSignIn}*/}
                        {/*    isLoading={isSigningIn}*/}
                        {/*/>*/}

                        <Button
                            title={isLoading ? "Logging in..." : "Login"}
                            onPress={handleLogin}
                            disabled={isLoading}
                        />

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 40,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444', // Red-500
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 8,
        paddingHorizontal: 16,
        fontWeight: '500',
    },
});

export default Login;



// const handleGoogleSignIn = async (): Promise<void> => {
//     try {
//         // Validate form first
//         const validationError = validateUserForm(formData.username, formData.age);
//         if (validationError) {
//             Alert.alert('Validation Error', validationError);
//             return;
//         }
//
//         // Sign in with Google
//         const googleAccount = await signInWithGoogle();
//         if (!googleAccount) return;
//
//         // Combine form data with Google account details
//         const loginData: LoginData = {
//             ...formData,
//             ...googleAccount,
//         };
//
//         // Handle login
//         await AuthService.handleLogin(loginData);
//
//         Alert.alert(
//             'Login Successful!',
//             `Welcome ${googleAccount.name}!\nEmail: ${googleAccount.email}`,
//             [{ text: 'OK' }]
//         );
//     } catch (error: any) {
//         Alert.alert('Login Error', error.message);
//     }
// };