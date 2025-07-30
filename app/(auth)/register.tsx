import { View, Text, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { useUserProfileStore } from "@/store/userProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { images } from "@/constants";

// Vector icons
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "@/components/Button";
import {useRouter} from "expo-router";

const Register = () => {
    const router = useRouter()

    const profile = useUserProfileStore();
    const { register , error , isLoading} = useAuthStore();

    const handleSignUp = async  () => {

        try {

            await register({
                user : {
                    username : profile.username,
                    password : profile.username + profile.age
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
                    otherHealthConditionDescription: profile.otherHealthConditionDescription,
                }
            });

            router.push("/(root)/(tabs)/(home)" as any);
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView className="flex-1 p-5">
            <View className="items-center justify-center mt-5">
                <Text className="text-3xl">
                    Heal<Text className="text-primary-500">Verse</Text>
                </Text>
            </View>

            {/* image */}
            <View className="w-full flex items-center justify-center my-3">
                <Image
                    source={images.onboarding5 as ImageSourcePropType}
                    className="h-32 w-28 object-contain"
                />
            </View>

            <View className="px-4 py-6  rounded-xl space-y-2">
                <InfoRow icon={<FontAwesome5 name="user" size={20} color="black" />} label="Gender" value={profile.gender === 'MALE' ? 'Male' : 'Female'} />
                <InfoRow icon={<MaterialIcons name="height" size={20} color="black" />} label="Height" value={`${profile.heightCm} cm`} />
                <InfoRow icon={<FontAwesome5 name="birthday-cake" size={20} color="black" />} label="Age" value={`${profile.age}`} />
                <InfoRow icon={<FontAwesome5 name="weight" size={20} color="black" />} label="Current Weight" value={`${profile.currentWeightKg} kg`} />
                <InfoRow icon={<FontAwesome5 name="bullseye" size={20} color="black" />} label="Target Weight" value={`${profile.targetWeightKg} kg`} />
                <InfoRow icon={<FontAwesome5 name="couch" size={20} color="black" />} label="Activity Level" value={profile.activityLevel.replace('_', ' ').toLowerCase()} />
                <InfoRow icon={<FontAwesome5 name="flag-checkered" size={20} color="black" />} label="Goal" value={profile.goal.replace('_', ' ').toLowerCase()} />
                <InfoRow icon={<FontAwesome5 name="hourglass-start" size={20} color="black" />} label="Weight Loss Speed" value={profile.weightLossSpeed.toLowerCase()} />
                <InfoRow icon={<MaterialCommunityIcons name="food-apple" size={20} color="black" />} label="Dietary Restriction" value={profile.dietaryRestriction.toLowerCase()} />
                <InfoRow icon={<FontAwesome5 name="heartbeat" size={20} color="black" />} label="Health Condition" value={profile.healthCondition.toLowerCase()} />
                {profile.healthCondition === 'OTHER' && profile.otherHealthConditionDescription && (
                    <InfoRow icon={<FontAwesome5 name="sticky-note" size={20} color="black" />} label="Other Condition" value={profile.otherHealthConditionDescription} />
                )}
            </View>

            {/*error message*/}

            {error && (
                <Text className=" text-center rounded-full p-1 my-3 text-white bg-red-200">{error}</Text>
            )}

            <Button disabled={isLoading} title={isLoading ? "Signing Up.." : "SignUp"}  onPress={() => handleSignUp()}/>
        </SafeAreaView>
    );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
        <View className="flex-row items-center gap-3">
            {icon}
            <Text className="text-gray-600 font-medium">{label}</Text>
        </View>
        <Text className="text-black font-semibold">{value}</Text>
    </View>
);

export default Register;
