import { dayNames } from "@/constants/data";
import { generateWeekDates } from "@/lib/utils";
import React, {memo, useRef, useState} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const DaySelector = memo(({ selectedDate, handleDateChange , showDate = true , showButton = true }: {
    selectedDate : string;
    handleDateChange : (date : string) => void;
    showDate : boolean;
    showButton : boolean;
}) => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        return startOfWeek;
    });

    const scrollRef = useRef<ScrollView | null>(null);

    const weekDates = generateWeekDates(currentWeekStart);

    // Navigate to previous week
    const goToPreviousWeek = (): void => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newWeekStart);
    };

    // Navigate to next week
    const goToNextWeek = (): void => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newWeekStart);
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };


    const isSelected = (date: Date): boolean => {
        return date.toISOString().split('T')[0] === selectedDate;
    };


    return (
        <View className="flex-row bg-gray-100 rounded-sm py-1 items-center justify-between">
            { showButton && (
                <TouchableOpacity className="p-1" onPress={goToPreviousWeek}>
                    <Text className="text-2xl text-gray-400">‹</Text>
                </TouchableOpacity>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                className="flex-1 mx-2"
            >
                <View className="flex-row space-x-2">
                    {weekDates.map((date, index) => {
                        const isCurrentDay = isToday(date);
                        const isSelectedDay = isSelected(date);

                        return (
                            <TouchableOpacity
                                key={`${date.getTime()}-${index}`}
                                onPress={() =>
                                    handleDateChange(date.toISOString().split("T")[0])
                                }
                                className={`flex items-center px-1 py-1 rounded-lg min-w-[47px] ${
                                    isSelectedDay ? "bg-blue-200" : "bg-transparent"
                                }`}
                            >
                                <Text
                                    className={`text-xs ${
                                        isSelectedDay ? "text-blue-500" : "text-gray-600"
                                    }`}
                                >
                                    {dayNames[date.getDay()]}
                                </Text>
                                {showDate && (<Text
                                    className={`text-xs ${
                                        isSelectedDay ? "text-blue-500" : "text-gray-800"
                                    }`}
                                >
                                    {date.getDate()}
                                </Text>)}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            {showButton && (<TouchableOpacity className="p-1" onPress={goToNextWeek}>
                <Text className="text-2xl text-gray-400">›</Text>
            </TouchableOpacity>)}
        </View>
    );
});

DaySelector.displayName = "DaySelector";

export default DaySelector;