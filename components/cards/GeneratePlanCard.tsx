import { images } from "@/constants";
import { Button } from "@/components/ui/Button";
import React from "react";
import { Image, Text, View } from "react-native";

interface GeneratePlanCardProps {
  onGenerate: () => void;
  /** False while offline: generating needs the server. */
  canGenerate: boolean;
}

/** Empty state of the Diet tab for a day that has no plan yet. */
const GeneratePlanCard = ({ onGenerate, canGenerate }: GeneratePlanCardProps) => (
  <View className="flex-1 items-center justify-center gap-4 px-6 py-6">
    <Image source={images.dietPlanStart} resizeMode="contain" className="h-60 w-full shrink" accessible={false} />
    <Text accessibilityRole="header" className="text-center font-display text-lg text-foreground">
      No meal plan for today yet
    </Text>
    <Text className="text-center font-body text-sm text-muted-foreground">
      We will build meals around your goals. It takes about half a minute.
    </Text>
    <Button title="Generate my plan" onPress={onGenerate} disabled={!canGenerate} />
    {!canGenerate && (
      <Text className="text-center font-body text-xs text-muted-foreground">Needs an internet connection.</Text>
    )}
  </View>
);

export default GeneratePlanCard;
