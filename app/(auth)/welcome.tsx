import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import Header from "@/components/Header";
import WelcomeContent from "@/components/WelcomeContent";
import ActionButtons from "@/components/ActionButtons";
import { router } from "expo-router";
import Button from "@/components/Button";

const Welcome: React.FC = () => (
  <>
    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    <SafeAreaView className="flex-1 bg-white p-3 gap-y-3">
      <View className="flex-1">
        <Header progress={1} showProgress={true} />

        <WelcomeContent />

        <View className="flex-1  flex items-center justify-center">
          <Button
            title="If you have account, please sign in here"
            onPress={() => router.push("/(auth)/login" as any)}
            variant="secondary"
            className="bg-blue-50 border-nones shadow-none  w-fit text-center mx-auto px-2 !py-1  rounded-full"
            textClassName="text-blue-500 font-jakarta-medium text-center text-xs  italic"
          />
        </View>

        <Button
          title="Get Started"
          onPress={() => router.push("/(auth)/(onboarding)/step1" as any)}
          variant="primary"
          className="bg-primary-500 py-3  shadow-medium mb-5"
          textClassName="text-white font-jakarta-semi-bold text-lg"
        />
      </View>
    </SafeAreaView>
  </>
);

export default Welcome;
