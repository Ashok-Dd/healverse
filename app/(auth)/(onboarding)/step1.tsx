import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { images } from "@/constants";
import { useUserProfileStore } from "@/store/userProfile";
import type { Gender } from "@/types/type";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const OPTIONS: { value: Gender; label: string; image: any }[] = [
  { value: "MALE", label: "Male", image: images.male },
  { value: "FEMALE", label: "Female", image: images.female },
];

export default function Step1() {
  const gender = useUserProfileStore((s) => s.gender);
  const setGender = useUserProfileStore((s) => s.setGender);

  return (
    <OnboardingScreen
      step={1}
      title="What's your gender?"
      subtitle="We use it to work out the calories and nutrients your body needs."
    >
      <View accessibilityRole="radiogroup" className="flex-row gap-4">
        {OPTIONS.map((option) => {
          const selected = gender === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setGender(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              className={`flex-1 items-center rounded-3xl border-2 px-3 py-5 active:opacity-80 ${
                selected ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <Image
                source={option.image}
                className="h-52 w-full"
                resizeMode="contain"
                accessible={false}
              />
              <Text
                className={`mt-3 font-display text-lg ${
                  selected ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mt-6 text-center font-body text-sm text-muted-foreground">
        If neither fits, choose the one closest to your hormonal profile.
      </Text>
    </OnboardingScreen>
  );
}
