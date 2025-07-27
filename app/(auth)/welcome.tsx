import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const welcome = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-black text-5xl font-bold ">
          Heal<Text className="text-green-500">Verse</Text>
        </Text>
      </View>
      <View className="w-[90%] mx-auto">
        <Button
          icon="arrow-forward"
          onPress={() => router.push("/(auth)/(onboarding)/step1")}
        />
      </View>
    </SafeAreaView>
  );
};

export default welcome;
