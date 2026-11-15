import { dayNames } from "@/constants/data";
import { generateWeekDates } from "@/lib/utils";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

interface DaySelectorProps {
  selectedDate: string | null | undefined;
  handleDateChange: (date: string) => void;
  /** Show the day number under the weekday. */
  showDate?: boolean;
  /** Show the previous / next week arrows. */
  showButton?: boolean;
}

// Dates are exchanged as UTC `YYYY-MM-DD` strings; see getCurrentDate in store/dietPlan.ts.
const toDateString = (date: Date) => date.toISOString().split("T")[0];

const startOfWeek = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay()); // Sunday
  return start;
};

const DaySelector = memo(function DaySelector({
  selectedDate,
  handleDateChange,
  showDate = true,
  showButton = true,
}: DaySelectorProps) {
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek);

  const todayString = useMemo(() => new Date().toDateString(), []);
  const weekDates = useMemo(() => generateWeekDates(weekStart), [weekStart]);

  const shiftWeek = useCallback((days: number) => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + days);
      return next;
    });
  }, []);

  return (
    <View className="flex-row items-center rounded-2xl bg-muted px-1 py-1">
      {showButton && (
        <Pressable
          onPress={() => shiftWeek(-7)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          className="h-11 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color={colors.mutedForeground} />
        </Pressable>
      )}

      <View className="flex-1 flex-row justify-between">
        {weekDates.map((date) => {
          const dateString = toDateString(date);
          const selected = dateString === selectedDate;
          const isToday = date.toDateString() === todayString;

          return (
            <Pressable
              key={dateString}
              onPress={() => handleDateChange(dateString)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${dayNames[date.getDay()]} ${date.getDate()}${isToday ? ", today" : ""}`}
              className={`min-h-[48px] min-w-[40px] flex-1 items-center justify-center rounded-xl ${
                selected ? "bg-primary" : ""
              }`}
            >
              <Text
                className={`font-body-semibold text-xs ${
                  selected ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {dayNames[date.getDay()]}
              </Text>
              {showDate && (
                <Text
                  className={`font-display text-base ${
                    selected ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </Text>
              )}
              <View
                className={`mt-0.5 h-1 w-1 rounded-full ${
                  isToday ? (selected ? "bg-primary-foreground" : "bg-primary") : "bg-transparent"
                }`}
              />
            </Pressable>
          );
        })}
      </View>

      {showButton && (
        <Pressable
          onPress={() => shiftWeek(7)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next week"
          className="h-11 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
});

export default DaySelector;
