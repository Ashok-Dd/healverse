import { dayNames } from "@/constants/data";
import { generateWeekDates } from "@/lib/utils";
import React, { memo, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DaySelectorProps {
  selectedDate: string | null | undefined;
  handleDateChange: (date: string) => void;
  showDate?: boolean;
  showButton?: boolean;
}

const DaySelector = memo(
  ({
    selectedDate,
    handleDateChange,
    showDate = true,
    showButton = true,
  }: DaySelectorProps) => {
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
      try {
        const today = new Date();
        return date.toDateString() === today.toDateString();
      } catch (error) {
        console.error("Error checking if date is today:", error);
        return false;
      }
    };

    const isSelected = (date: Date): boolean => {
      try {
        if (!selectedDate || typeof selectedDate !== "string") return false;

        const dateStr = date.toISOString().split("T")[0];
        return dateStr === selectedDate;
      } catch (error) {
        console.error("Error checking if date is selected:", error, {
          date,
          selectedDate,
        });
        return false;
      }
    };

    const handleDatePress = (date: Date): void => {
      try {
        const dateString = date.toISOString().split("T")[0];
        handleDateChange(dateString);
      } catch (error) {
        console.error("Error handling date press:", error, { date });
      }
    };

    return (
      <View className="flex-row bg-gray-100 rounded-sm py-1 items-center justify-between">
        {showButton && (
          <TouchableOpacity className="p-1" onPress={goToPreviousWeek}>
            <Text className="text-2xl text-gray-400 ml-2">‹</Text>
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
                  onPress={() => handleDatePress(date)}
                  className={`flex items-center px-1 py-1 rounded-lg min-w-[47px] ${
                    isSelectedDay ? "bg-blue-200" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isSelectedDay ? "text-blue-500" : "text-gray-600"
                    }`}
                  >
                    {dayNames[date.getDay()] || "N/A"}
                  </Text>
                  {showDate && (
                    <Text
                      className={`text-xs ${
                        isSelectedDay ? "text-blue-500" : "text-gray-800"
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                  )}
                  {/* Optional: Show today indicator */}
                  {isCurrentDay && (
                    <View className="w-1 h-1 bg-green-500 rounded-full mt-0.5" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        {showButton && (
          <TouchableOpacity className="p-1" onPress={goToNextWeek}>
            <Text className="text-2xl text-gray-400 pr-2">›</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

DaySelector.displayName = "DaySelector";

export default DaySelector;
