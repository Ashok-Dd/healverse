import ErrorCard from "@/components/cards/ErrorCard";
import DaySelector from "@/components/DaySelector";
import GlobalHeader from "@/components/headers/GlobalHeader";
import MealCard from "@/components/MealCard";
import NutritionInfo from "@/components/NutritionInfo";
import PlaceHolder from "@/components/PlaceHolder";
import Skeleton from "@/components/skeleton/Skeleton";
import GuidanceButton from "@/components/ui/GuidanceButton";
import IconButton from "@/components/ui/IconButton";
import { INFO_ABOUT_DIET_PLAN } from "@/constants";
import { showToast } from "@/lib/toast";
import { useDietPlanManager } from "@/store/dietPlan";
import { DietPlan, Meal, MealType } from "@/types/type";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Register the linear gradient globally
// SkeletonPlaceholder.setLinearGradient(LinearGradient);

const Profile = () => {
  const {
    selectedDate,
    handleDateChange,
    isValidDate,
    dietPlan,
    isLoading,
    error,
    totalNutrition,
    // getMealsByType,
    replaceMeal,
    isReplacing,
    handleReGenerate,
    handleRefresh,
    isRegenerating,
    isRefreshing,
    isToday,
  } = useDietPlanManager();

  const handleGenerateNewPlan = async () => {
    try {
      console.log("Generating new plan for date:", selectedDate);
      if (dietPlan) {
        await handleReGenerate((dietPlan as unknown as DietPlan)?.id);
      }

      // Optionally, you can add any post-generation logic here
    } catch (error) {
      console.error("Failed to generate new plan:", error);
    }
  };

  // const handleRefreshPlan = async () => {
  //   try {
  //     console.log("Refreshing plan for date:", selectedDate);
  //     await handleRefresh();
  //   } catch (error) {
  //     console.error("Failed to refresh plan:", error);
  //   }
  // };

  const handleReplaceMeal = async (mealType: MealType) => {
    try {
      console.log("Replacing meal:", mealType);
      // Call the API or perform the necessary action to replace the meal
      await replaceMeal.mutateAsync(
        {
          mealType,
          dietPlanId: dietPlan?.id!,
        },
        {
          onSuccess: () => {
            showToast("Meal replaced successfully");
          },
          onError: (error) => {
            showToast("Error replacing meal:");
          },
        }
      );
    } catch (error) {
      console.error("Failed to replace meal:", error);
    }
  };

  const handleDateChangeWrapper = (date: string) => {
    try {
      console.log("Date changed to:", date);
      handleDateChange(date);
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-1 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <GlobalHeader />

      {/*<TabSwitcher tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />*/}

      {/* Always show Date Selector */}
      <DaySelector
        selectedDate={selectedDate}
        handleDateChange={handleDateChangeWrapper}
        showDate={false}
        showButton={false}
      />

      {/* Conditional Rendering Section Below DateSelector */}
      {isLoading || isRegenerating ? (
        <MealPlanSkeleton />
      ) : error && !dietPlan ? (
        <ErrorCard message={error} onPress={handleRefresh} />
      ) : !isValidDate ? (
        <PlaceHolder message="You're on invalid date ...!" />
      ) : !dietPlan ? (
        <PlaceHolder message="You haven't created diet plan here." />
      ) : (
        <ScrollView
          className="flex-1 py-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            // Pull to refresh control
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Nutrition Info */}
          <View>
            <View className="flex-row items-center  ml-3">
              <Text className="text-2xl mr-2">≡</Text>
              <Text className="text-xs font-semibold text-gray-800">
                Daily Total
              </Text>

              <GuidanceButton
                title="About Diet Plan"
                content={INFO_ABOUT_DIET_PLAN}
                variant="icon-only"
                size="small"
              />
            </View>
            <NutritionInfo
              calories={totalNutrition.calories}
              protein={totalNutrition.protein}
              carbs={totalNutrition.carbs}
              fat={totalNutrition.fat}
            />
          </View>

          {/* Refresh Button */}
          <View className="mb-4 px-2 gap-3 flex-row items-center justify-between">
            <Text className="text-xs font-medium text-gray-800 flex-1 pr-2">
              Balanced Healthy Indian Diet Plan for User
            </Text>
            {isToday && (<IconButton
              iconName="refresh-cw"
              loadingIconName="loader"
              label="AI Replace Day"
              loadingLabel="Generating..."
              loading={isRegenerating}
              onPress={handleGenerateNewPlan}
            />)}
          </View>

          {/* Meals List */}
          {dietPlan?.meals && dietPlan!.meals?.length > 0 ? (
            <View className="px-2 gap-y-5">
              {isRefreshing && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-80 z-10 justify-center items-center">
                  <Text className="text-gray-600">Refreshing...</Text>
                </View>
              )}

              {(dietPlan!.meals as Meal[]).map((item, index) => (
                <MealCard
                  id={item.id}
                  key={`${item.id}-${index}`}
                  mealType={item.mealType}
                  mealName={item.mealName}
                  ingredients={item.ingredients}
                  instructions={item.instructions}
                  preparationTimeMinutes={item.preparationTimeMinutes}
                  calories={item.calories}
                  protein={item.protein}
                  fat={item.fat}
                  carbs={item.carbs}
                  healthBenefits={item.healthBenefits}
                  mealIcon=""
                  isReplacing={isReplacing}
                  onReplaceMeal={(replaceMeal) =>
                    handleReplaceMeal(replaceMeal)
                  }
                  isToday={isToday}
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 bg-white flex justify-center items-center py-20">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                No Meals Added
              </Text>
              <TouchableOpacity
                onPress={handleGenerateNewPlan}
                disabled={isRegenerating}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">
                  {isRegenerating ? "Generating..." : "Generate Diet Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const MealPlanSkeleton = () => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Tab Selector Skeleton */}
      <View className="bg-white py-1 border-gray-200">
        <View className="flex-row bg-gray-100 rounded-xl p-1 mx-2">
          <View className="flex-1 py-1 rounded-xl">
            <View className="flex-row items-center justify-center">
              <Skeleton height={20} width={120} />
            </View>
          </View>
          <View className="flex-1 py-1 rounded-xl">
            <View className="flex-row items-center justify-center">
              <Skeleton height={20} width={100} />
            </View>
          </View>
        </View>
      </View>

      {/* Daily Total Skeleton */}
      <View className="px-2">
        <View className="flex-row items-center mb-2 ml-3">
          <Skeleton height={24} width={150} />
        </View>
        {/* Nutrition Info Skeleton */}
        <View className="bg-white rounded-lg p-3 mx-1 mb-3 shadow-sm">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Skeleton height={16} width={60} />
              <Skeleton height={20} width={40} className="mt-1" />
            </View>
            <View className="items-center">
              <Skeleton height={16} width={50} />
              <Skeleton height={20} width={30} className="mt-1" />
            </View>
            <View className="items-center">
              <Skeleton height={16} width={40} />
              <Skeleton height={20} width={35} className="mt-1" />
            </View>
            <View className="items-center">
              <Skeleton height={16} width={30} />
              <Skeleton height={20} width={25} className="mt-1" />
            </View>
          </View>
        </View>
      </View>

      {/* Refresh Button Skeleton */}
      <View className="mb-4 px-2 gap-3 flex-row items-center justify-between">
        <Skeleton height={16} width="60%" />
        <Skeleton height={32} width={100} />
      </View>

      {/* Meals List Skeleton */}
      <View className="px-2 space-y-4">
        {[...Array(4)].map((_, index) => (
          <View key={index} className="bg-white rounded-lg p-4 shadow-sm">
            {/* Meal Header */}
            <Skeleton height={300} width={"100%"} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 12,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
