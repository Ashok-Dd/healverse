import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { Button } from "@/components/ui/Button";
import { images } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome: React.FC = () => (
  <>
    <ThemedStatusBar />
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-8 pb-6">
        <View className="flex-1 items-center">
          <Text
            accessibilityRole="header"
            className="text-5xl font-display-bold text-foreground text-center"
          >
            HealVerse
          </Text>
          <Text className="text-lg font-body text-muted-foreground text-center mt-2">
            Eat well, feel better.{"\n"}One meal at a time.
          </Text>

          <View className="flex-1 w-full mt-6 mb-4 min-h-[180px] justify-center">
            <Image
              source={images.welcomeHero}
              className="flex-1 w-full"
              resizeMode="contain"
              accessible={false}
            />
          </View>
        </View>

        <Button
          variant="default"
          title="Get started"
          onPress={() => router.push("/(auth)/(onboarding)/step1" as any)}
        />
        <Button
          variant="ghost"
          title="I already have an account"
          onPress={() => router.push("/(auth)/login" as any)}
          className="mt-2"
        />
      </View>
    </SafeAreaView>
  </>
);

export default Welcome;
