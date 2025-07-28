import React, { useState } from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import Header from '@/components/Header';
import WelcomeContent from "@/components/WelcomeContent";
import ActionButtons from "@/components/ActionButtons";
import {router} from "expo-router";

const Welcome : React.FC = () => {

    const [loading, setLoading] = useState(false);
    const handleSyncHealth = () => {

    }

    const handleContinue = () => {
        setLoading(true);
        // Navigate to onboarding section
        setTimeout(() => {
            router.push('/(auth)/(onboarding)/step1');
            setLoading(false);
        }, 500); // Small delay for UX
    }

    const handleSignIn = () => {

    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <SafeAreaView className="flex-1 bg-white">
                <ScrollView

                >
                    <Header progress={1} showProgress={true} />
                    <WelcomeContent />
                    <ActionButtons
                        onSyncHealth={handleSyncHealth}
                        onSignIn={handleSignIn}
                        onContinue={handleContinue}
                        loading={loading}
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Welcome;
