import Ping from "@/components/Calorie-counter-button";
import { Text, TouchableOpacity, View } from "react-native";
import FoodLoggingTrackerCard from "@/components/cards/FoodLoggingTrackerCard";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import { useDateSelectorForHealthStore } from "@/store/healthStore";
import { NutritionGrid } from "@/components/CalorieProgress";
import { Feather, Ionicons } from "@expo/vector-icons";
import DaySelector from "@/components/DaySelector";
import { useSummaryData } from "@/hooks/useSummaryData";
import GlobalHeader from "@/components/headers/GlobalHeader";


const Tracker = () => {
    const { selectedDate, setSelectedDate } = useDateSelectorForHealthStore();

    const {
        data: dailySummary,
        // isLoading,
        // error
    } = useSummaryData(selectedDate);

    const handleDateChange = useCallback(
        (date: string) => {
            setSelectedDate(date);
        },
        [setSelectedDate]
    );


    return (
        <SafeAreaView className="flex-1 px-2 py-1 bg-white">
            {/* Healverse header */}
            <GlobalHeader />


            {/* Date Selector */}
            <DaySelector
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
            />

            <View className=" flex-row flex  items-center justify-between ">
                <View className="flex flex-row gap-1  items-center  ">
                    <Feather name="clock" size={16} />
                    <Text className="text-font-semibold">Logged Foods</Text>
                </View>
                <TouchableOpacity className="">
                    <Feather name="arrow-right-circle" size={20} color={"skyblue"} />
                </TouchableOpacity>
            </View>


            <View>
                <FoodLoggingTrackerCard date={selectedDate} />
            </View>


            <View className="flex items-start ">
                <View className="my-2 flex flex-row gap-1  items-center  ">
                    <Ionicons name="analytics" size={16} />
                    <Text className="text-font-semibold">Nutrition Overview</Text>
                </View>
            </View>

            {dailySummary && (
                <NutritionGrid
                    data={dailySummary}
                    types={["calories", "protein", "fat", "carbs"]}
                    size={90}
                />
            )}


            <Ping />
        </SafeAreaView>
    );
};

export default Tracker;
