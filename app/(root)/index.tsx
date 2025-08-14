import { CircularProgress } from "@/components/ui/CircularProgress";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Types
interface WellnessMetric {
  id: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  label: string;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

interface InsightMessage {
  id: string;
  message: string;
  type: "positive" | "neutral" | "motivational";
  icon: string;
}

const MetricCard: React.FC<WellnessMetric> = ({
  value,
  target,
  unit,
  color,
  label,
}) => {
  const progress = (value / target) * 100;
  return (
    <View
      className="h-40 flex-1 m-2 p-4 rounded-2xl border border-gray-100 bg-white items-center justify-center"
      style={{ minWidth: (width - 56) / 2 - 8, maxWidth: (width - 56) / 2 - 8 }}
    >
      <CircularProgress
        progress={progress}
        size={90}
        strokeWidth={5}
        progressColor={color}
        backgroundColor="#F3F4F6"
        label={value.toString()}
        subLabel={unit}
        labelStyle={{ fontSize: 14, fontWeight: "bold" }}
        subLabelStyle={{ fontSize: 10 }}
      />
      <Text className="text-xs text-gray-600 mt-2 font-medium">{label}</Text>
      <Text className="text-xs text-gray-400">
        {value}/{target} {unit}
      </Text>
    </View>
  );
};

const WellnessDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentStreak, setCurrentStreak] = useState(12);
  const [bestStreak, setBestStreak] = useState(18);

  // Sample data - replace with your actual data sources
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([
    {
      id: "calories",
      value: 1870,
      target: 2200,
      unit: "kcal",
      color: "#10B981", // Emerald green
      label: "Calories",
    },
    {
      id: "water",
      value: 6,
      target: 8,
      unit: "glasses",
      color: "#3B82F6", // Blue
      label: "Water",
    },
    {
      id: "steps",
      value: 8432,
      target: 10000,
      unit: "steps",
      color: "#8B5CF6", // Purple
      label: "Steps",
    },
    {
      id: "mood",
      value: 80,
      target: 100,
      unit: "%",
      color: "#F59E0B", // Amber
      label: "Mood",
    },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "1",
      title: "Diet AI",
      description: "Track meals & get nutrition insights",
      icon: "restaurant-outline",
      color: "#10B981",
      link: "/(root)/(tabs)/tracker",
    },
    {
      id: "2",
      title: "Medicine Tracker",
      description: "Next dose in 3 hrs",
      icon: "medical-outline",
      color: "#EF4444",
      link: "/(root)/(med-tabs)/home",
    },
    {
      id: "3",
      title: "Meditation Helper",
      description: "Start a calming session",
      icon: "leaf-outline",
      color: "#8B5CF6",
      link: "/(root)/(meditation-tabs)/meditate",
    },
    {
      id: "4",
      title: "Yoga Companion",
      description: "Track your yoga sessions and progress",
      icon: "analytics-outline",
      color: "#F59E0B",
      link: "",
    },
  ]);

  const [insights] = useState<InsightMessage[]>([
    {
      id: "1",
      message:
        "You're radiating positive energy today! Your morning meditation & breakfast choices set the amazing day! ✨",
      type: "positive",
      icon: "sunny-outline",
    },
    {
      id: "2",
      message:
        "Your body loves everything your mind says. Choose kindness in your thoughts today.",
      type: "motivational",
      icon: "heart-outline",
    },
  ]);

  const [calendarData] = useState(() => {
    // Generate sample calendar data for December 2024
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 1; i <= 31; i++) {
      const date = new Date(currentYear, currentMonth, i);
      if (date.getMonth() === currentMonth) {
        days.push({
          day: i,
          hasActivity: Math.random() > 0.3, // Random activity for demo
          isToday: i === today.getDate(),
          activityLevel: Math.floor(Math.random() * 3) + 1, // 1-3 activity levels
        });
      }
    }
    return days;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const renderFeatureCard = (feature: TaskItem, onPress: () => void) => (
    <TouchableOpacity
      key={feature.id}
      className={`flex-1 min-w-[46%] max-w-[46%] m-1 p-4 rounded-2xl border border-gray-100 shadow-sm bg-white`}
      style={{
        elevation: 2,
        flexBasis: "48%",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: feature.color + "22" }}
      >
        <Ionicons name={feature.icon as any} size={28} color={feature.color} />
      </View>
      <Text
        className={`font-semibold text-base text-center mb-1 ${"text-gray-800"}`}
        numberOfLines={1}
      >
        {feature.title}
      </Text>
      <Text
        className={`text-xs text-center ${"text-gray-500"}`}
        numberOfLines={2}
      >
        {feature.description}
      </Text>
    </TouchableOpacity>
  );

  const renderInsightCard = (insight: InsightMessage) => (
    <View
      key={insight.id}
      className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl mb-3 border border-blue-100"
    >
      <View className="flex-row items-start">
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
          <Ionicons name={insight.icon as any} size={16} color="#3B82F6" />
        </View>
        <Text className="flex-1 text-sm text-gray-700 leading-5">
          {insight.message}
        </Text>
      </View>
    </View>
  );

  const renderCalendarDay = (day: any) => {
    const activityColors = ["", "#FEE2E2", "#FED7AA", "#D1FAE5"]; // Light red, orange, green

    return (
      <TouchableOpacity
        key={day.day}
        className={`w-8 h-8 rounded-lg items-center justify-center mx-1 mb-2 ${
          day.isToday ? "bg-blue-500" : ""
        }`}
        style={{
          backgroundColor: day.hasActivity
            ? activityColors[day.activityLevel]
            : "#F9FAFB",
        }}
      >
        <Text
          className={`text-xs font-medium ${
            day.isToday ? "text-white" : "text-gray-700"
          }`}
        >
          {day.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              {getGreeting()}, {user?.username || "User"}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Ready to make today amazing?
            </Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
            <Text className="text-blue-600 font-bold text-lg">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={16} color="#F59E0B" />
            <Text className="text-sm text-gray-600 ml-1">0 left</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={16} color="#8B5CF6" />
            <Text className="text-sm text-gray-600 ml-1">4:12</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="notifications" size={16} color="#EF4444" />
            <Text className="text-sm text-gray-600 ml-1">2:30 PM</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Features Section */}
        <View className="px-3 mt-6">
          <View className="flex-row flex-wrap justify-between">
            {tasks.map((feature) =>
              renderFeatureCard(feature, () => {
                // Navigation logic here, e.g.:
                // navigation.navigate(feature.id)
                // For now, just toggle for demo:
                router.push(feature.link as any);
              })
            )}
          </View>
        </View>

        {/* Today's Wellness Section */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-6">
            Today's Wellness
          </Text>
          <View className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <View className="flex-row justify-between">
              <MetricCard {...wellnessMetrics[0]} />
              <MetricCard {...wellnessMetrics[1]} />
            </View>
            <View className="flex-row justify-between">
              <MetricCard {...wellnessMetrics[2]} />
              <MetricCard {...wellnessMetrics[3]} />
            </View>
          </View>
        </View>

        {/* Insights Section */}
        <View className="px-6 mt-8">
          <View className="flex-row items-center mb-4">
            <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Wellness Insights
            </Text>
          </View>
          {insights.map(renderInsightCard)}

          <TouchableOpacity className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <View className="flex-row items-center justify-center">
              <Ionicons name="eye-outline" size={18} color="#3B82F6" />
              <Text className="text-blue-600 font-medium ml-2">Show me</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <View className="px-6 mt-8">
          <View className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
            <View className="items-center">
              <Ionicons name="heart" size={24} color="#EC4899" />
              <Text className="text-center text-gray-700 mt-3 leading-6">
                Your body hears everything your mind says.{"\n"}
                Choose kindness in your thoughts today.
              </Text>
            </View>
          </View>
        </View>

        {/* Wellness Journey Calendar */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Wellness Journey
          </Text>
          <Text className="text-sm text-gray-500 mb-6">December 2024</Text>

          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Calendar Header */}
            <View className="flex-row justify-between mb-4">
              <Text className="text-xs font-medium text-gray-400">T</Text>
              <Text className="text-xs font-medium text-gray-400">W</Text>
              <Text className="text-xs font-medium text-gray-400">T</Text>
              <Text className="text-xs font-medium text-gray-400">F</Text>
              <Text className="text-xs font-medium text-gray-400">S</Text>
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap">
              {calendarData.map(renderCalendarDay)}
            </View>

            {/* Streak Stats */}
            <View className="flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                  <Text className="text-orange-600 font-bold text-lg">
                    {currentStreak}
                  </Text>
                </View>
                <Text className="text-xs text-gray-600 text-center">
                  Current Streak
                </Text>
              </View>

              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Text className="text-purple-600 font-bold text-lg">
                    {bestStreak}
                  </Text>
                </View>
                <Text className="text-xs text-gray-600 text-center">
                  Best Streak
                </Text>
              </View>
            </View>

            <Text className="text-center text-green-600 text-sm font-medium mt-4">
              Amazing consistency! You're building healthy habits! 🎯
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="px-3 py-1 mt-8 mx-auto bg-blue-100 rounded-2xl "
          onPress={() => router.push("/(root)/medical-checkups")}
        >
          <Text className="text-blue-600 text-xs">
            Health checkup scheduler
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WellnessDashboard;
