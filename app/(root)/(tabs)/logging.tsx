import DaySelector from "@/components/DaySelector";
import ExerciseLogs from "@/components/ExerciseLogs";
import FoodLogs from "@/components/FoodLogs";
import GlobalHeader from "@/components/headers/GlobalHeader";
import PlaceHolder from "@/components/PlaceHolder";
import SummarySection from "@/components/SummarySection";
import WaterLogs from "@/components/WaterLogs";
import { useDateSelectorForHealthStore } from "@/store/healthStore";
import React, { useCallback } from "react";
import { StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const DietLoggingApp: React.FC = () => {
  const { selectedDate, setSelectedDate, isValidDate } =
    useDateSelectorForHealthStore();

  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  return (
    <SafeAreaView className="flex-1 px-2 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      {/* Header */}
      <GlobalHeader />

      {/* Date Selector */}
      <DaySelector
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />

      {!isValidDate ? (
        <PlaceHolder message="You are not on valid date." />
      ) : (
        <ScrollView className="py-2" showsHorizontalScrollIndicator={false}>
          <SummarySection date={selectedDate} />

          <ExerciseLogs date={selectedDate} />

          <WaterLogs date={selectedDate} />

          <FoodLogs date={selectedDate} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DietLoggingApp;
