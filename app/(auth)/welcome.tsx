import React, { useState } from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import Header from '@/components/Header';
import WelcomeContent from "@/components/WelcomeContent";
import ActionButtons from "@/components/ActionButtons";
import {router} from "expo-router";
import Button from "@/components/Button";

const Welcome : React.FC = () => {






    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <SafeAreaView className="flex-1 bg-white p-3 gap-y-3">
                <ScrollView

                >
                    <Header progress={1} showProgress={true} />
                    <WelcomeContent />


                    <View className="mb-6">
                        <Button
                            title="If you have account, please sign in here"
                            onPress={() => router.push("/(auth)/login" as any)}
                            variant="secondary"
                            className="bg-blue-50 py-1 max-w-[70%] mx-auto px-2  rounded-full"
                            textClassName="text-blue-500 font-jakarta-medium text-xs"
                        />
                    </View>



                    <Button
                        title="Get Started"
                        onPress={() => router.push("/(auth)/(onboarding)/step1" as any)}
                        variant="primary"
                        className="bg-primary-500 py-3 rounded-2xl shadow-medium"
                        textClassName="text-white font-jakarta-semi-bold text-lg"
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Welcome;
