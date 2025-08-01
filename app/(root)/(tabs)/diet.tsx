import {FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import DaySelector from "@/components/DaySelector";
import React, {useEffect, useState} from "react";
import useDietPlanStore from "@/store/dietPlan";
import {SafeAreaView} from "react-native-safe-area-context";
import NutritionInfo from "@/components/NutritionInfo";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import MealCard from "@/components/MealCard";
import {Meal} from "@/types/type";

const Profile = () => {
    const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

    const {
        dietPlan,
        selectedDate,
        setSelectedDate,
        fetchDietPlan,
    } = useDietPlanStore();

    useEffect(() => {
        fetchDietPlan();
    } , [selectedDate]);


    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };




    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Header */}
            <View className="bg-white px-4 py-1">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <Text className="text-sm mr-2">🥗</Text>
                        <Text className="text-sm font-bold text-green-600">HealVerse</Text>
                    </View>
                </View>
            </View>

            {/* Date Selector */}
            <DaySelector
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                showDate={false}
                showButton={false}
            />


            {dietPlan ? (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="bg-white py-1  border-gray-200">
                        {/* Tab Selector */}
                        <View className="flex-row bg-gray-100 rounded-xl p-1">
                            <TouchableOpacity
                                className={`flex-1 py-1 rounded-xl ${
                                    activeTab === "weekly" ? "bg-white shadow-sm" : ""
                                }`}
                                activeOpacity={0.4}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-lg mr-2">
                                        <MaterialCommunityIcons name="calendar-week" size={15} />
                                    </Text>
                                    <Text
                                        className={`font-medium ${
                                            activeTab === "weekly" ? "text-gray-800" : "text-gray-600"
                                        }`}
                                    >
                                        Weekly Plan
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab("daily")}
                                className={`flex-1 py-1 rounded-xl ${
                                    activeTab === "daily" ? "bg-white shadow-sm" : ""
                                }`}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-lg mr-2">
                                        <MaterialCommunityIcons name="calendar-check" size={15} />
                                    </Text>
                                    <Text
                                        className={`font-medium ${
                                            activeTab === "daily" ? "text-gray-800" : "text-gray-600"
                                        }`}
                                    >
                                        Daily Plan
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="px-2">
                        <View className="flex-row items-center mb-2 ml-3 ">
                            <Text className="text-2xl mr-2">≡</Text>
                            <Text className="text-xl font-semibold text-gray-800">
                                Daily Total
                            </Text>
                        </View>
                        <NutritionInfo calories={0} protein={0} carbs={0} fat={0} />
                    </View>
                    <View className="mb-4 px-2 gap-3 flex-row items-center justify-between">
                        {/* Title Text */}
                        <Text className="text-sm font-medium text-gray-800 flex-1 pr-2">
                            Balanced Healthy Indian Diet Plan for User
                        </Text>

                        {/* Refresh AI Button */}
                        <TouchableOpacity className="bg-blue-100 px-2 py-1 rounded-full">
                            <View className="flex-row items-center space-x-1">
                                <Feather name="refresh-cw" size={14} color="#1D4ED8" />
                                <Text className="text-blue-700 text-xs">AI Replace Day</Text>
                            </View>
                        </TouchableOpacity>
                    </View>



                    {dietPlan.meals.length > 0 ? (
                        <View className="px-2">
                            {(dietPlan.meals as Meal[]).map((item , index) => (
                                <MealCard
                                    key={index}
                                    mealType={item.mealType}
                                    mealName={item.mealName}
                                    ingredients={item.ingredients}
                                    instructions={item.instructions}
                                    prepTime={item.preparationTimeMinutes}
                                    calories={item.calories}
                                    protein={item.protein}
                                    fat={item.fat}
                                    carbs={item.carbs}
                                    healthBenefits={item.healthBenefits}


                                />
                            ))}
                        </View>
                    ) : (
                        <View className="flex-1 bg-white flex justify-center items-center">
                            <Text className="text-xl font-bold text-gray-800">
                                No Meals Added
                            </Text>
                        </View>
                    )}
                </ScrollView>
            ) : (
                <View className="flex-1 bg-white flex justify-center items-center">
                    <Text className="text-xl font-bold text-gray-800">
                        Please create a diet plan
                    </Text>
                </View>
            )}

        </SafeAreaView>
    )
}

export default Profile ;


