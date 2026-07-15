import GamificationSection from "@/components/GamificationSection";
import { PromoteCardExamples } from "@/components/PromotionCard";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfile";
import { User } from "@/types/type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";



const ProfileSection = ({
    user,
    onSettingsPress,
    onLogoutPress,
}: {
    user: User;
    onSettingsPress: () => void;
    onLogoutPress: () => void;
}) => {

    const getCurrentWeight = (): string => {
        return user.profile?.currentWeightKg
            ? `${user.profile.currentWeightKg} kg`
            : "70.8 kg";
    };

    return (
        <View className="mx-6 mt-2 mb-4">
            <LinearGradient
                colors={["#F8FAFC", "#F1F5F9"]}
                className="rounded-2xl p-1 shadow-sm"
            >
                {/* Top Row - User Info and Settings */}
                <View className="flex-row justify-between  items-center mb-2">
                    <View className="flex-row gap-3 py-1 px-1 items-center">
                        <Text className="text-black text-center flex items-center bg-gray-200 uppercase justify-center w-10 h-10 rounded-full  text-lg font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </Text>
                        <View>
                            <Text className="text-gray-900 text-md font-semibold">
                                {user?.username}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                                {user?.profile?.age} years old
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push("/(root)/settings" as any)}
                        className="bg-blue-100 px-4 py-1 rounded-xl flex-row items-center border border-blue-100"
                    >
                        <Text className="text-blue-500 text-xs mr-2">
                            <Feather name="settings" />
                        </Text>
                        <Text className="text-blue-500 text-xs font-medium">Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Row - Weight and Sign In */}
                <View className="flex-row  justify-between items-center">
                    <View className="bg-white px-3 py-1 rounded-xl flex-row items-center gap-5 shadow-sm border border-gray-100 flex-1 mr-4">
                        <Text className="text-black text-lg">
                            <MaterialCommunityIcons name="scale-bathroom" size={20} />
                        </Text>
                        <View>
                            <Text className="text-gray-500 text-xs font-medium mb-1">
                                Current Weight
                            </Text>
                            <Text className="text-gray-900 text-xs font-bold">
                                {getCurrentWeight()}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onLogoutPress}
                        className="bg-red-100 py-1 px-6 rounded-xl flex-row items-center shadow-sm"
                    >
                        <Text className="text-red-500 text-xs mr-2">✓</Text>
                        <Text className="text-red-500 text-xs ">Sign out</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

// const WeightProgressChart = ({ profile }: { profile: UserProfile }) => {
//     const screenWidth = Dimensions.get("window").width;

//     // Generate weight progress data
//     const weightData = [76, 50, 24];
//     const labels = ["Jul 28", "Dec 5", "Dec 10"];

//     const Gradient = () => (
//         <Defs>
//             <SVGLinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
//                 <Stop offset="0%" stopColor="red" stopOpacity={1} />
//                 <Stop offset="50%" stopColor="orange" stopOpacity={1} />
//                 <Stop offset="100%" stopColor="green" stopOpacity={1} />
//             </SVGLinearGradient>
//         </Defs>
//     );

//     return (
//         <View className="bg-white mb-1">
//             <View className="mx-6 mb-4">
//                 <Text className="text-sm font-bold  text-gray-900 mb-1">
//                     Weight Progress
//                 </Text>
//                 <Text className="text-gray-500 text-sm">
//                     Your journey from {weightData[0]}kg to {profile.targetWeightKg || 65}
//                     kg
//                 </Text>
//             </View>

//             <View className="bg-white rounded-2xl  shadow-sm border border-gray-100">
//                 <LineChart
//                     data={{
//                         labels: labels,
//                         datasets: [
//                             {
//                                 data: weightData,
//                                 // Use gradient ID for the line stroke
//                                 color: () => `url(#lineGradient)`,
//                                 strokeWidth: 10,
//                             },
//                         ],
//                     }}
//                     width={screenWidth}
//                     height={220}
//                     yAxisSuffix="kg"
//                     bezier
//                     chartConfig={{
//                         backgroundColor: "#fff",
//                         backgroundGradientFrom: "#fff",
//                         backgroundGradientTo: "#fff",
//                         color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//                         strokeWidth: 4,
//                     }}
//                     withShadow={false}
//                     withInnerLines={false}
//                     withOuterLines={false}
//                     withVerticalLabels={true}
//                     withHorizontalLabels={true}
//                     fromZero={false}
//                     style={{
//                         marginVertical: 8,
//                         borderRadius: 16,
//                     }}
//                     // Inject our gradient definition
//                     decorator={() => <Gradient />}
//                 />

//                 {/* Progress indicators */}
//                 {/* <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-red-500">
//               {weightData[0]}kg
//             </Text>
//             <Text className="text-gray-500 text-xs">Start Weight</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-blue-500">
//               {weightData[weightData.length - 1]}kg
//             </Text>
//             <Text className="text-gray-500 text-xs">Current</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-green-500">
//               {profile.targetWeightKg || 65}kg
//             </Text>
//             <Text className="text-gray-500 text-xs">Target</Text>
//           </View>
//         </View> */}
//             </View>
//         </View>
//     );
// };

const WeightUpdateSection = ({
    onUpdatePress,
}: {
    onUpdatePress: () => void;
}) => {
    const screenWidth = Dimensions.get("window").width;

    // Recent weight history data
    const recentWeightData = [78, 55, 55, 55, 72];
    const recentLabels = ["Jul 30", "Aug 01", "Aug 03", "Aug 05", "Aug 07"];

    const chartConfig = {
        backgroundColor: "transparent",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "#3B82F6",
        },
        fillShadowGradient: "#3B82F6",
        fillShadowGradientOpacity: 0.1,
    };

    return (
        <View className="bg-white mt-5">
            <View className="flex-row mx-6 py-1 justify-between items-center mb-4">
                <View>
                    <Text className="text-sm font-bold text-gray-900 mb-1">
                        Daily Weight Tracking
                    </Text>
                    <Text className="text-gray-500 text-sm">
                        Keep track of your daily progress
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onUpdatePress}
                    className="bg-blue-100 px-4 py-1 rounded-xl flex-row items-center shadow-sm"
                >
                    <Text className="text-blue-500 text-sm font-medium mr-1">+</Text>
                    <Text className="text-blue-500 text-sm font-medium">Update</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <LineChart
                    data={{
                        labels: recentLabels,
                        datasets: [
                            {
                                data: recentWeightData,
                                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    width={screenWidth}
                    height={160}
                    yAxisSuffix="kg"
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    fromZero={false}
                />
            </View>
        </View>
    );
};

// Main Profile Component
const Profile = () => {
    const { user, logout } = useAuthStore();
    const { clearProfile } = useUserProfileStore();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    try {
                        console.log("🔄 Starting comprehensive logout cleanup...");

                        // 1. Clear all TanStack Query cache
                        console.log("🗑️ Clearing TanStack Query cache...");
                        queryClient.clear();

                        // 2. Clear user profile store
                        console.log("👤 Clearing user profile store...");
                        clearProfile();

                        // 3. Cancel all scheduled notifications
                        console.log("🔔 Canceling all scheduled notifications...");
                        await Notifications.cancelAllScheduledNotificationsAsync();

                        // 4. Clear notification settings from SecureStore
                        try {
                            await SecureStore.deleteItemAsync("notification_settings");
                            console.log("✅ Notification settings cleared");
                        } catch (error) {
                            console.warn("⚠️ Could not clear notification settings:", error);
                        }

                        // 5. Clear any task-related storage (if needed)
                        const taskKeys = [
                            "health_reminders",
                            "user_preferences"
                        ];

                        for (const key of taskKeys) {
                            try {
                                await SecureStore.deleteItemAsync(key);
                                console.log(`✅ Cleared storage key: ${key}`);
                            } catch (error) {
                                console.warn(`⚠️ Could not clear ${key}:`, error);
                            }
                        }

                        // 6. Clear auth store and token (this should be last)
                        console.log("🔐 Clearing authentication data...");
                        if (logout) {
                            await logout();
                        }

                        console.log("✅ Logout cleanup completed successfully!");

                        // 7. Navigate to welcome screen
                        router.replace("/(auth)/welcome");

                    } catch (error) {
                        console.error("❌ Error during logout cleanup:", error);
                        // Still navigate to welcome screen even if there's an error
                        router.replace("/(auth)/welcome");
                    }
                },
            },
        ]);
    };

    const handleSettings = () => {
        console.log("Settings pressed");
        // router.push('/settings');
    };

    const handleUpdateWeight = () => {
        console.log("Update weight pressed");
        // Navigate to weight update screen or show modal
    };

    if (!user || !user.profile) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <View className="bg-white p-8 rounded-2xl shadow-sm mx-6">
                    <Text className="text-gray-900 text-xl font-semibold mb-2 text-center">
                        Profile Not Found
                    </Text>
                    <Text className="text-gray-500 text-center mb-6">
                        Please complete your profile setup
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.replace("/(auth)/welcome")}
                        className="bg-blue-500 px-6 py-3 rounded-xl"
                    >
                        <Text className="text-white font-semibold text-center">
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    return (
        <SafeAreaView className="flex-1 bg-white ">
            <ScrollView
                className="flex-1 bg-gray-50 "
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }}
            >
                <View className="bg-white px-6 py-4 shadow-sm">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Text className="text-white text-lg mr-2 font-bold">🥗</Text>
                            <Text className="text-xl font-bold text-green-500">Heal</Text>
                            <Text className="text-xl font-bold">Verse</Text>
                        </View>
                    </View>
                </View>

                <ProfileSection
                    user={user as User}
                    onSettingsPress={handleSettings}
                    onLogoutPress={handleLogout}
                />

                {/* Gamification Section */}
                <GamificationSection />

                {/* <CaloriesProgressExample /> */}

                <WeightUpdateSection onUpdatePress={handleUpdateWeight} />

                <View className="flex-1 ">
                    <PromoteCardExamples />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
