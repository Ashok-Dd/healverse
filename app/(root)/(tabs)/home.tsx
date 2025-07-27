import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Nutrition Info Component
const NutritionInfo = ({ calories, protein, fat, carbs }) => (
  <View className="flex-row justify-between bg-gray-50 rounded-xl p-4 mb-4">
    <View className="items-center flex flex-row">
      <MaterialCommunityIcons name="fire" size={15} color={"red"} />
      <View className="flex justify-center items-center">
        <Text className="text-lg font-bold text-orange-600">
          {calories}kcal
        </Text>
        <Text className="text-xs text-gray-500">Calories</Text>
      </View>
    </View>

    <View className="items-center flex flex-row">
      <MaterialCommunityIcons name="food-drumstick" color={"blue"} size={15} />
      <View className="flex justify-center items-center">
        <Text className="text-lg font-bold text-blue-600">{protein}g</Text>
        <Text className="text-xs text-gray-500">Protein</Text>
      </View>
    </View>
    <View className="items-center flex flex-row">
      <Entypo name="drop" color={"orange"} size={15} />
      <View className="flex justify-center items-center">
        <Text className="text-lg font-bold text-orange-600">{fat}g</Text>
        <Text className="text-xs text-gray-500">Fat</Text>
      </View>
    </View>
    <View className="items-center flex flex-row">
      <Entypo name="leaf" color={"green"} size={15} />
      <View className="flex justify-center items-center">
        <Text className="text-lg font-bold text-green-600">{carbs}g</Text>
        <Text className="text-xs text-gray-500">Carbs</Text>
      </View>
    </View>
  </View>
);

// Meal Card Component
const MealCard = ({
  mealType,
  mealName,
  ingredients,
  instructions,
  prepTime,
  calories,
  protein,
  fat,
  carbs,
  healthBenefits,
  mealIcon,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getMealTypeIcon = () => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "☀️";
      case "lunch":
        return "☁️";
      case "dinner":
        return "🌙";
      default:
        return "🍽️";
    }
  };

  return (
    <View className=" rounded-xl  px-2 ">
      {/* Meal Header */}
      <View className="px-4 py-1 justify-center">
        <View className="flex-row items-center justify-between my-2">
          <View className="flex-row  items-center">
            <Text className="text-xl mr-2">{getMealTypeIcon()}</Text>
            <Text className="text-xl font-bold text-gray-800 capitalize">
              {mealType}
            </Text>
          </View>

          <View className="flex-row  items-center gap-2">
            <View className="flex-row items-center bg-gray-100 rounded-full px-1 ">
              <Text className="text-sm">
                <MaterialCommunityIcons name="fire" color={"red"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-red-500 ml-1">
                {calories}kcal
              </Text>
            </View>

            <View className="flex-row items-center   bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <MaterialCommunityIcons
                  name="food-drumstick"
                  color={"blue"}
                  size={12}
                />
              </Text>
              <Text className="text-sm font-semibold text-blue-600 ml-1">
                {protein}g
              </Text>
            </View>

            <View className="flex-row items-center  bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <Entypo name="drop" color={"orange"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-orange-400 ml-1">
                {fat}g
              </Text>
            </View>

            <View className="flex-row items-center  bg-gray-100 rounded-full px-1  ">
              <Text className="text-sm">
                <MaterialCommunityIcons name="leaf" color={"green"} size={12} />
              </Text>
              <Text className="text-sm font-semibold text-green-600 ml-1">
                {carbs}g
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meal Content */}
      <View className="p-4 bg-gray-100 rounded-lg ">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">{mealIcon}</Text>
          <Text className="text-lg font-semibold text-gray-800 flex-1">
            {mealName}
          </Text>
        </View>

        {/* Ingredients */}
        <View className="mb-4">
          {ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-400 mr-2">•</Text>
              <Text className="text-sm text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* How to prepare */}
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">🔧</Text>
            <Text className="text-base font-semibold text-gray-800">
              How to prepare
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">⏱️</Text>
            <Text className="text-sm text-gray-600">{prepTime} minutes</Text>
          </View>
        </TouchableOpacity>

        {showDetails && (
          <View className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-700 leading-5">
              {instructions}
            </Text>
          </View>
        )}

        {/* Health Benefits */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-lg mr-2">💚</Text>
            <Text className="text-base font-semibold text-gray-800">
              Health benefits
            </Text>
          </View>
          <Text className="text-sm text-gray-700 leading-5">
            {healthBenefits}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-5">
          <TouchableOpacity className="px-4 bg-blue-100 rounded-full py-2 flex-row items-center justify-center gap-1 ">
            <Feather name="refresh-cw" size={14} color="#1D4ED8" />
            <Text className="text-blue-700 text-xs">AI Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 bg-green-100 rounded-full py-2 flex-row items-center justify-center gap-1 ">
            <Feather name="plus" color={"green"} />
            <Text className="text-green-700 text-xs">Log Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Day Selector Component
const DaySelector = ({ selectedDay, onDaySelect }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View className="flex-row justify-between rounded-lg bg-gray-100 mb-4">
      {days.map((day, index) => (
        <TouchableOpacity
          key={day}
          onPress={() => onDaySelect(day)}
          className={`flex-1 py-2 mx-1 rounded-lg ${
            selectedDay === day ? "bg-blue-200" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-center text-sm font-medium ${
              selectedDay === day ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main Diet Plan Screen
const DietPlanScreen = () => {
  const [selectedDay, setSelectedDay] = useState("Fri");
  const [activeTab, setActiveTab] = useState("daily");

  // Static meal data
  const mealData = [
    {
      mealType: "breakfast",
      mealName: "Masala Oats with Low-Fat Milk",
      mealIcon: "🥣",
      ingredients: [
        "50 g rolled oats",
        "1 cup low-fat milk",
        "1 small tomato chopped",
        "1 small onion chopped",
        "1 green chili chopped",
        "1/4 tsp mustard seeds",
        "1/4 tsp turmeric powder",
        "5 curry leaves",
        "Salt to taste",
        "1 tsp oil",
      ],
      instructions:
        "Heat oil in a pan, add mustard seeds and curry leaves. Add onions and chili, sauté until soft. Add chopped tomato and turmeric powder, cook for 2 minutes. Add oats and milk, stir well and cook till oats are soft. Add salt to taste.",
      prepTime: 15,
      calories: 320,
      protein: 15,
      fat: 5.0,
      carbs: 45,
      healthBenefits:
        "High in fiber and protein for sustained energy and improved digestion.",
    },
    {
      mealType: "lunch",
      mealName:
        "Grilled Tandoori Chicken with Brown Rice and Mixed Vegetable Salad",
      mealIcon: "🍗",
      ingredients: [
        "100 g skinless chicken breast",
        "1/2 cup cooked brown rice",
        "1 cup mixed salad (cucumber, tomato, carrot)",
        "1 tbsp hung curd",
        "1/2 tsp garam masala",
        "1/2 tsp red chili powder",
        "1/4 tsp turmeric powder",
        "1 tsp ginger-garlic paste",
        "Salt to taste",
        "1 tsp olive oil",
      ],
      instructions:
        "Marinate chicken with hung curd, spices, and ginger-garlic paste for 30 minutes. Grill or cook in a pan until done. Serve with brown rice and fresh mixed vegetable salad drizzled with olive oil and lemon.",
      prepTime: 45,
      calories: 420,
      protein: 35,
      fat: 8.0,
      carbs: 55,
      healthBenefits:
        "Excellent source of lean protein, complex carbs, and essential vitamins for muscle building and sustained energy.",
    },
    {
      mealType: "dinner",
      mealName: "Dal Tadka with Roti and Steamed Vegetables",
      mealIcon: "🍛",
      ingredients: [
        "50 g mixed dal (lentils)",
        "2 small whole wheat rotis",
        "1 cup steamed vegetables (broccoli, carrot, beans)",
        "1 small onion chopped",
        "2 tomatoes chopped",
        "1 tsp cumin seeds",
        "1/2 tsp turmeric powder",
        "1 tsp coriander powder",
        "2 cloves garlic",
        "1 inch ginger",
        "1 tsp ghee",
      ],
      instructions:
        "Cook dal with turmeric until soft. In another pan, heat ghee, add cumin seeds, ginger-garlic paste, and onions. Add tomatoes and spices, cook until mushy. Add cooked dal and simmer for 10 minutes. Serve with fresh rotis and steamed vegetables.",
      prepTime: 30,
      calories: 380,
      protein: 18,
      fat: 6.0,
      carbs: 65,
      healthBenefits:
        "Rich in plant protein, fiber, and essential minerals. Supports digestive health and provides sustained energy.",
    },
  ];

  const totalNutrition = mealData.reduce(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      fat: total.fat + meal.fat,
      carbs: total.carbs + meal.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">🥗</Text>
          <Text className="text-xl font-bold text-gray-800">
            Heal<Text className="text-green-500">Verse</Text>
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1">
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

        {/* Day Selector */}
        <View className="py-2">
          <DaySelector selectedDay={selectedDay} onDaySelect={setSelectedDay} />
        </View>
        {/* Plan Title */}
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

        {/* Daily Nutrition Summary */}
        <NutritionInfo
          calories={totalNutrition.calories}
          protein={totalNutrition.protein}
          fat={totalNutrition.fat}
          carbs={totalNutrition.carbs}
        />
        {/* Meal Cards */}
        {mealData.map((meal, index) => (
          <MealCard
            key={index}
            mealType={meal.mealType}
            mealName={meal.mealName}
            mealIcon={meal.mealIcon}
            ingredients={meal.ingredients}
            instructions={meal.instructions}
            prepTime={meal.prepTime}
            calories={meal.calories}
            protein={meal.protein}
            fat={meal.fat}
            carbs={meal.carbs}
            healthBenefits={meal.healthBenefits}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DietPlanScreen;
