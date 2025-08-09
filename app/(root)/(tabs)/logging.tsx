import CalorieSummary from "@/components/CalorieSummary";
import DaySelector from "@/components/DaySelector";
import LogCard from "@/components/LogCard";
import {
    ExerciseLogHolder,
    FoodLogHolder,
    WaterLogHolder,
} from "@/components/LogHolders";
import NutritionInfo from "@/components/NutritionInfo";
import { WaterLogModal } from "@/components/WaterLogModel";
import {ExerciseLog, FoodLog, HealthData, MealType, WaterLog} from "@/types/type";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    useDashboardData,
    useDateSelectorForHealthStore,
} from "@/store/healthStore";
import PlaceHolder from "@/components/PlaceHolder";
import LoggingSkeleton from "@/components/skeleton/LoggingSkeleton";

const DietLoggingApp: React.FC = () => {
    const [openWaterModel, setOpenWaterModel] = useState(false);

    const { selectedDate, setSelectedDate , isValidDate} = useDateSelectorForHealthStore();

    console.log(selectedDate);

    const {
        data: healthData,
        isLoading,
        error,
        refetch,
    } = useDashboardData(selectedDate);

    console.log(healthData)

    const handleDateChange = useCallback(
        (date: string) => {
            setSelectedDate(date);
        },
        [setSelectedDate]
    );

    const renderErrorCard = () => (
        <View className="bg-red-100 p-4 rounded-lg m-4">
            <Text className="text-red-600 font-semibold mb-2">⚠ Oops!</Text>
            <Text className="text-red-500 mb-3">
                Something went wrong while loading your dashboard.
            </Text>
            <TouchableOpacity
                onPress={() => refetch()}
                className="bg-red-500 px-4 py-2 rounded-lg"
            >
                <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
        </View>
    );



    const renderContent = () => (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Remaining Calorie Section */}
            <View className="flex-row items-center mb-2 px-5">
                <Text className="text-xl mr-2">🏠</Text>
                <Text className="text-xl font-semibold text-gray-800">
                    Remaining Calorie
                </Text>
                <View className="ml-auto">
                    <Feather name="info" color={"skyblue"} size={20} />
                </View>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 mx-4 mb-4 shadow-sm">
                <CalorieSummary healthData={healthData!} />
            </View>

            {/* Daily Total */}
            <View className="px-2">
                <View className="flex-row items-center mb-2 ml-3 ">
                    <Text className="text-2xl mr-2">≡</Text>
                    <Text className="text-xl font-semibold text-gray-800">
                        Daily Total
                    </Text>
                </View>
                <NutritionInfo
                    calories={(healthData as HealthData)?.summary.caloriesProgress! || 0}
                    carbs={(healthData as HealthData)?.summary.carbsProgress!}
                    fat={(healthData as HealthData)?.summary.fatProgress!}
                    protein={(healthData as HealthData)?.summary.proteinProgress!}
                />
            </View>

            {/* Exercise Log */}
            <LogCard<ExerciseLog>
                icon="🏃"
                title="Exercise"
                description="Move more, feel better!"
                buttonText="+ Log Exercise"
                Link={() => router.push("/(root)/add-exercise-log")}
                showArrow={true}
                emojiIcon="👥"
                backgroundStyle="bg-green-50"
                items={(healthData as HealthData)?.exerciseLogs || []}
                component={ExerciseLogHolder}
                moveTo={() => router.push("/(root)/all-logs/exercise" as any)}
            />

            {/* Water Log */}
            <LogCard<WaterLog>
                icon="💧"
                title="Water"
                description="Recommended: 3700mL"
                buttonText="+ Log Water"
                showArrow={true}
                emojiIcon="🥛"
                backgroundStyle="bg-blue-50"
                items={(healthData as HealthData)?.waterLogs || []}
                component={WaterLogHolder}
                Link={() => setOpenWaterModel(true)}
                moveTo={() => router.push("/(root)/all-logs/water" as any)}
            />

            {/* Food Logs */}
            {(["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as MealType[]).map((mealType, idx) => {
                const titles = {
                    BREAKFAST: "Breakfast",
                    LUNCH: "Lunch",
                    DINNER: "Dinner",
                    SNACK: "Snacks",
                };
                const emojis = {
                    BREAKFAST: "🍽",
                    LUNCH: "🥗",
                    DINNER: "🍝",
                    SNACK: "🍫",
                };
                return (
                    <LogCard<FoodLog>
                        key={idx}
                        icon="🍴"
                        title={titles[mealType]}
                        description={
                            mealType === "SNACK"
                                ? "Mindful snacking helps energy!"
                                : "Recommended meal intake"
                        }
                        buttonText={mealType === "SNACK" ? "+ Log Snack" : "+ Log Food"}
                        Link={() => router.push("/(root)/calorie-counter")}
                        showArrow={false}
                        emojiIcon={emojis[mealType]}
                        backgroundStyle="bg-orange-50"
                        items={
                            ((healthData as HealthData)?.foodLogs as FoodLog[])?.filter(f => f.mealType === mealType) as FoodLog[] || []
                        }
                        component={FoodLogHolder}
                    />
                );
            })}
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Header */}
            <View className="bg-white px-4 py-3">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <Text className="text-2xl mr-2">🥗</Text>
                        <Text className="text-xl font-bold text-green-600">HealVerse</Text>
                    </View>
                </View>
            </View>

            {/* Date Selector */}
            <DaySelector
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
            />

            {isLoading ? (
                <LoggingSkeleton />
            ) : error ? (
                renderErrorCard()
            ) : !isValidDate ? (
                <PlaceHolder message="You're on invalid date ...!" />
            ) : !healthData ? (
                <PlaceHolder message="You are not on this day.!" />
            ) : (
                renderContent()
            )}

            {/* Water Log Modal */}
            <WaterLogModal
                visible={openWaterModel}
                onClose={() => setOpenWaterModel(false)}
                currentIntake={(healthData as HealthData)?.summary?.waterConsumedMl || 0}
                dailyGoal={(healthData as HealthData)?.summary?.targetWaterMl || 0}
            />
        </SafeAreaView>
    );
};

export default DietLoggingApp;
