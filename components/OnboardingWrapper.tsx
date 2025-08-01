import { images } from "@/constants";
import useCurrentStep from "@/hooks/useCurrentStep";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import StepProgressBar from "./StepProgressBar";

const OnboardingWrapper = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const { currentStep, totalSteps } = useCurrentStep();

  return (
    <SafeAreaView className="flex-1 p-3 gap-y-3">
      {/* progress bar */}
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {/* ttile */}
      <View className=" items-center justify-center">
        <Text className=" text-3xl">
          Heal<Text className="text-green-500">Verse</Text>
        </Text>
      </View>

      {/* iamge */}
      <View className="w-full flex items-center justify-center my-3">
        <Image
          source={
            images[
              ("onboarding" + currentStep) as string
            ] as ImageSourcePropType
          }
          className="h-28 w-28 object-contain"
        />
      </View>

      {/* step */}
      <View className="flex-1  overflow-y-auto flex">{children}</View>

      {/* buttton */}
      <Button
        onPress={() => {
          currentStep < totalSteps
            ? router.push(`/(auth)/(onboarding)/step${currentStep + 1}` as any)
            : router.push("/(auth)/register" as any);
        }}
        className="!max-w-[75%] mx-auto mb-10"
      />
    </SafeAreaView>
  );
};

export default OnboardingWrapper;
