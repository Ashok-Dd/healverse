import { images } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfile";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/Button";
import { useLocation } from "@/hooks/useLocation";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Register = () => {
  const router = useRouter();

  const {
    location,
    region,
    isLoading: locationLoading,
    error: locationError,
    getLocation,
    clearError
  } = useLocation();

  const profile = useUserProfileStore(
    useShallow((state) => ({
      username: state.username,
      password: state.password,
      gender: state.gender,
      age: state.age,
      heightCm: state.heightCm,
      currentWeightKg: state.currentWeightKg,
      targetWeightKg: state.targetWeightKg,
      activityLevel: state.activityLevel,
      goal: state.goal,
      weightLossSpeed: state.weightLossSpeed,
      dietaryRestriction: state.dietaryRestriction,
      healthCondition: state.healthCondition,
      otherHealthConditionDescription: state.otherHealthConditionDescription,
    }))
  );
  const { register, error, isLoading } = useAuthStore();

  // Get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  // Helper function to build address string
  const buildAddress = () => {
    if (!region) return "Location not available";
    
    const parts = [
      region.street,
      region.name,
      region.city,
      region.region,
      region.postalCode,
      region.country,
    ].filter(Boolean); // Remove null/undefined values
    
    return parts.join(", ");
  };

  const handleSignUp = async () => {
    // Check if location is available
    if (!region) {
      Alert.alert("Location Required", "Please wait for location to load or try getting location again.");
      return;
    }

    try {
      clearError(); // Clear any existing errors
      await register({
        user: {
          username: profile.username,
          password: profile.password,
        },
        profile: {
          gender: profile.gender,
          age: profile.age,
          heightCm: profile.heightCm,
          currentWeightKg: profile.currentWeightKg,
          targetWeightKg: profile.targetWeightKg,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          weightLossSpeed: profile.weightLossSpeed,
          dietaryRestriction: profile.dietaryRestriction,
          healthCondition: profile.healthCondition,
          otherHealthConditionDescription:
            profile.otherHealthConditionDescription,
          address: buildAddress(),
        },
      });

      router.push("/(root)/(tabs)/tracker" as any);
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Registration Failed",
        error || "Something went wrong during registration. Please try again."
      );
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-8">
            {/* Logo Section */}
            <View className="items-center mb-8 mt-4">
              <View className="mb-6">
                <Image
                  source={images.logo as ImageSourcePropType}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-jakarta-bold text-primary-600">
                Heal<Text className="text-secondary-900">Verse</Text>
              </Text>
              <Text className="text-center font-jakarta-medium text-sm text-gray-600 mt-2">
                🌿 Your personalized wellness companion
              </Text>
            </View>

            {/* Title Section */}
            <View className="mb-6">
              <Text className="text-2xl font-jakarta-bold text-center text-secondary-800 mb-2">
                Complete Your Profile
              </Text>
              <Text className="text-base font-jakarta-regular text-center text-secondary-600">
                Review your information and confirm registration
              </Text>
            </View>

            {/* Profile Image */}
            <View className="items-center mb-6">
              <View className="bg-primary-50 rounded-full p-4 mb-2">
                <Image
                  source={images.onboarding5 as ImageSourcePropType}
                  className="h-20 w-16"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-sm font-jakarta-medium text-gray-600">
                Welcome, {profile.username}!
              </Text>
            </View>

            {/* Profile Information Card */}
            <View className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-2">
              <InfoRow
                icon={<FontAwesome5 name="user" size={16} color="#16a34a" />}
                label="Gender"
                value={profile.gender === "MALE" ? "Male" : "Female"}
              />
              <InfoRow
                icon={<MaterialIcons name="height" size={16} color="#16a34a" />}
                label="Height"
                value={`${profile.heightCm} cm`}
              />
              <InfoRow
                icon={<FontAwesome5 name="birthday-cake" size={16} color="#16a34a" />}
                label="Age"
                value={`${profile.age} years`}
              />
              <InfoRow
                icon={<FontAwesome5 name="weight" size={16} color="#16a34a" />}
                label="Current Weight"
                value={`${profile.currentWeightKg} kg`}
              />
              <InfoRow
                icon={<FontAwesome5 name="bullseye" size={16} color="#16a34a" />}
                label="Target Weight"
                value={`${profile.targetWeightKg} kg`}
              />
              <InfoRow
                icon={<FontAwesome5 name="running" size={16} color="#16a34a" />}
                label="Activity Level"
                value={profile.activityLevel.replace("_", " ").toLowerCase()}
              />
              <InfoRow
                icon={<FontAwesome5 name="flag-checkered" size={16} color="#16a34a" />}
                label="Goal"
                value={profile.goal.replace("_", " ").toLowerCase()}
              />
              <InfoRow
                icon={<FontAwesome5 name="tachometer-alt" size={16} color="#16a34a" />}
                label="Weight Loss Speed"
                value={profile.weightLossSpeed.toLowerCase()}
              />
              <InfoRow
                icon={<MaterialCommunityIcons name="food-apple" size={16} color="#16a34a" />}
                label="Dietary Restriction"
                value={profile.dietaryRestriction.toLowerCase()}
              />
              <InfoRow
                icon={<FontAwesome5 name="heartbeat" size={16} color="#16a34a" />}
                label="Health Condition"
                value={profile.healthCondition.toLowerCase()}
              />
              {profile.healthCondition === "OTHER" &&
                profile.otherHealthConditionDescription && (
                  <InfoRow
                    icon={<FontAwesome5 name="sticky-note" size={16} color="#16a34a" />}
                    label="Other Condition"
                    value={profile.otherHealthConditionDescription}
                  />
                )}

              {/* Location Info */}
              {locationLoading && (
                <View className="flex-row items-center justify-center py-6 gap-3">
                  <ActivityIndicator size="small" color="#16a34a" />
                  <Text className="text-secondary-600 font-jakarta-medium text-sm">
                    Getting your location...
                  </Text>
                </View>
              )}

              {region && !locationLoading && (
                <InfoRow
                  icon={<MaterialIcons name="location-on" size={16} color="#16a34a" />}
                  label="Location"
                  value={buildAddress()}
                />
              )}

              {locationError && (
                <View className="py-3">
                  <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                    <Text className="text-red-600 text-sm font-jakarta-medium text-center">
                      {locationError}
                    </Text>
                  </View>
                  <Button
                    title="Retry Location"
                    onPress={getLocation}
                    variant="secondary"
                    className="bg-primary-50 border border-primary-200"
                    textClassName="text-primary-600 font-jakarta-medium"
                  />
                </View>
              )}
            </View>

            {/* Error Messages */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <Text className="text-red-600 text-sm font-jakarta-medium text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Action Button */}
            <View className="mt-6 mb-8">
              <Button
                disabled={isLoading || locationLoading || !region}
                title={
                  locationLoading
                    ? "Getting Location..."
                    : isLoading
                    ? "Creating Account..."
                    : "Complete Registration"
                }
                onPress={handleSignUp}
                variant="primary"
                className="bg-primary-500 py-4 shadow-medium"
                textClassName="text-white font-jakarta-semi-bold text-lg"
              />
            </View>

            {/* Footer */}
            <View className="mb-4">
              <Text className="text-center text-gray-500 font-jakarta-regular text-xs">
                By registering, you agree to start your wellness journey 🌱
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center justify-between py-3 px-1 border-b border-gray-100">
    <View className="flex-row items-center gap-3 flex-1">
      <View className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
        {icon}
      </View>
      <Text className="text-secondary-700 font-jakarta-medium text-sm flex-1">{label}</Text>
    </View>
    <Text className="text-secondary-900 font-jakarta-semi-bold text-sm max-w-[50%] text-right">
      {value}
    </Text>
  </View>
);

export default Register;