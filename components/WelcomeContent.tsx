import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

const FeatureButton = ({
  icon,
  title,
  subtitle,
  color,
  reverse = false,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  reverse?: boolean;
}) => {
  return (
    <Pressable
      className={`bg-black rounded-full px-4 py-3 shadow-md flex-row items-center  mb-4 ${
        reverse ? "self-end mr-6" : "self-start ml-6"
      } w-[55%]`}
    >
      <MaterialCommunityIcons name={icon} size={15} color={color} />
      <View>
        <Text className="text-white ml-2 tracking-wider font-jakarta-semibold text-xs">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const WelcomeContent: React.FC = () => {
  return (
    <View className=" px-6 py-5  ">
      {/* 🔥 Title */}
      <View className="mb-6">
        <Text className="text-center text-2xl font-jakarta-bold text-gray-900">
          Welcome to HealVerse 🌿
        </Text>
        <Text className="text-center font-jakarta-extra-bold text-base text-gray-600 mt-1">
          Your personalized wellness companion
        </Text>
      </View>

      {/* 🚀 Features in Zigzag */}
      <FeatureButton
        icon="leaf"
        title="Ayurvedic Nutrition"
        subtitle="Custom diet plans rooted in tradition"
        color="#4caf50"
      />
      <FeatureButton
        icon="yoga"
        title="Yoga & Meditation"
        subtitle="Daily sessions for peace of mind"
        color="#7e57c2"
        reverse
      />

      <FeatureButton
        icon="star"
        title="Wellness Tracking"
        subtitle="Smart AI-powered recommendations"
        color="#ffc107"
      />

      {/* 🌱 Footer */}
      <View className="mt-10">
        <Text className="text-center text-gray-700 font-jakarta-regular text-sm">
          Let's begin your wellness journey 🧘‍♀️🍵
        </Text>
      </View>
    </View>
  );
};

export default WelcomeContent;
