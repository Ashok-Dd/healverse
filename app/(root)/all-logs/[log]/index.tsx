import DaySelector from "@/components/DaySelector";
import { BackHeader } from "@/components/headers/BackHeader";
import ExerciseLogsComponent from "@/components/logs/AllExersiceLogs";
import WaterLogsComponent from "@/components/logs/AllWaterLogs";
import PlaceHolder from "@/components/PlaceHolder";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { images } from "@/constants";
import { useDateSelectorForHealthStore } from "@/store/healthStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LogKind = "water" | "exercise";

interface LogType {
  id: LogKind;
  name: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  component: React.ComponentType<{ date: string }>;
}

const LOG_TYPES: LogType[] = [
  { id: "water", name: "Water", icon: "water-outline", component: WaterLogsComponent },
  { id: "exercise", name: "Exercise", icon: "barbell-outline", component: ExerciseLogsComponent },
];

/** Water and exercise entries for one day. The chips choose which kinds are listed. */
export default function AllLogs() {
  const { log } = useLocalSearchParams<{ log?: string }>();
  const { selectedDate, setSelectedDate, isValidDate } = useDateSelectorForHealthStore();
  const [selected, setSelected] = useState<Set<LogKind>>(
    () => new Set(LOG_TYPES.filter((type) => type.id === log).map((type) => type.id))
  );

  const toggle = (id: LogKind) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const visible = LOG_TYPES.filter((type) => selected.has(type.id));

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <BackHeader title="All logs" />
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pb-12"
          showsVerticalScrollIndicator={false}
        >
          <DaySelector selectedDate={selectedDate} handleDateChange={setSelectedDate} />

          <View className="mb-3 mt-3 flex-row gap-2">
            {LOG_TYPES.map((type) => {
              const on = selected.has(type.id);
              return (
                <Pressable
                  key={type.id}
                  onPress={() => toggle(type.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={type.name}
                  className={`min-h-[44px] flex-row items-center gap-2 rounded-full border px-4 active:opacity-80 ${
                    on ? "border-primary bg-primary" : "border-border bg-card"
                  }`}
                >
                  <Ionicons
                    name={type.icon}
                    size={18}
                    className={on ? "text-primary-foreground" : "text-muted-foreground"}
                  />
                  <Text
                    className={`font-body-semibold text-sm ${
                      on ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {type.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {!isValidDate ? (
            <PlaceHolder image={images.dietPlanUnavailable} message="There's no data for this date." />
          ) : visible.length === 0 ? (
            <PlaceHolder message="Pick Water or Exercise above to see your logs." />
          ) : (
            visible.map((type) => {
              const Component = type.component;
              return (
                <View key={type.id} className="mb-3 rounded-3xl border border-border bg-card p-4">
                  <View className="mb-3 flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
                      <Ionicons name={type.icon} size={20} className="text-accent-foreground" />
                    </View>
                    <Text accessibilityRole="header" className="font-display text-lg text-foreground">
                      {type.name}
                    </Text>
                  </View>
                  <Component date={selectedDate} />
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
