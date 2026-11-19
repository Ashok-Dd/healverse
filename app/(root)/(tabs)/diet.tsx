import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import ErrorCard from "@/components/cards/ErrorCard";
import GeneratePlanCard from "@/components/cards/GeneratePlanCard";
import DaySelector from "@/components/DaySelector";
import GlobalHeader from "@/components/headers/GlobalHeader";
import MealCard from "@/components/MealCard";
import NutritionInfo from "@/components/NutritionInfo";
import PlaceHolder from "@/components/PlaceHolder";
import { PlanProgress } from "@/components/skeleton/PlanProgress";
import { Button } from "@/components/ui/Button";
import GuidanceButton from "@/components/ui/GuidanceButton";
import IconButton from "@/components/ui/IconButton";
import { images, INFO_ABOUT_DIET_PLAN } from "@/constants";
import { useThemeColors } from "@/constants/theme";
import { useIsOnline } from "@/lib/network";
import { showToast } from "@/lib/toast";
import { useDietPlanManager } from "@/store/dietPlan";
import type { Meal, MealType } from "@/types/type";
import React, { useCallback } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Index is part of the key on purpose: generated meals can arrive without an id, or with a repeated one.
const keyExtractor = (meal: Meal, index: number) => `${meal.mealType}-${meal.id ?? "new"}-${index}`;

export default function Diet() {
  const colors = useThemeColors();
  const isOnline = useIsOnline();
  const {
    selectedDate,
    handleDateChange,
    isValidDate,
    dietPlan,
    isLoading,
    error,
    totalNutrition,
    replaceMeal,
    isReplacing,
    generate,
    isGenerating,
    handleReGenerate,
    handleRefresh,
    isRegenerating,
    isRefreshing,
    isToday,
  } = useDietPlanManager();

  const planId = dietPlan?.id;
  const replaceMealMutate = replaceMeal.mutate;
  const replacingType = isReplacing ? replaceMeal.variables?.mealType : undefined;

  // Failed requests are reported by the global mutation error toast.
  const handleGenerateNewPlan = useCallback(() => {
    if (planId !== undefined) handleReGenerate(planId).catch(() => {});
  }, [planId, handleReGenerate]);

  const handleGeneratePlan = useCallback(() => {
    generate(selectedDate).catch(() => {});
  }, [generate, selectedDate]);

  const handleReplaceMeal = useCallback(
    (mealType: MealType) => {
      if (planId === undefined) return;
      replaceMealMutate(
        { mealType, dietPlanId: planId },
        { onSuccess: () => showToast("Meal replaced") }
      );
    },
    [planId, replaceMealMutate]
  );

  const renderMeal = useCallback(
    ({ item }: { item: Meal }) => (
      <MealCard
        meal={item}
        isToday={isToday}
        isReplacing={replacingType === item.mealType}
        canReplace={isOnline}
        onReplace={handleReplaceMeal}
      />
    ),
    [isToday, replacingType, isOnline, handleReplaceMeal]
  );

  const meals = (dietPlan?.meals ?? []) as Meal[];

  const header = (
    <View className="pb-4 pt-2">
      <View className="mb-2 flex-row items-center justify-between">
        <Text accessibilityRole="header" className="font-display text-base text-foreground">
          Daily total
        </Text>
        <GuidanceButton title="About diet plan" content={INFO_ABOUT_DIET_PLAN} />
      </View>
      <NutritionInfo {...totalNutrition} />
      {isToday && (
        <View className="mt-3 flex-row justify-end">
          <IconButton
            iconName="refresh-cw"
            label={isOnline ? "Replace whole day" : "Replace whole day (needs internet)"}
            loadingLabel="Generating..."
            loading={isRegenerating}
            disabled={!isOnline}
            onPress={handleGenerateNewPlan}
          />
        </View>
      )}
    </View>
  );

  const body = (() => {
    if (isRegenerating) return <PlanProgress kind="regenerating" />;
    if (isGenerating) return <PlanProgress kind="generating" />;
    if (isLoading) return <PlanProgress kind="loading" />;
    if (error && !dietPlan) {
      return (
        <ErrorCard
          message={error instanceof Error ? error.message : String(error)}
          onPress={handleRefresh}
        />
      );
    }
    if (!isValidDate) {
      return <PlaceHolder image={images.dietPlanUnavailable} message="There's no meal plan for this date." />;
    }
    if (!dietPlan && !isOnline) {
      return (
        <PlaceHolder
          image={images.dietPlanUnavailable}
          message="This day's plan is not saved on your phone yet. Connect to the internet to load it."
        />
      );
    }
    if (!dietPlan) {
      return isToday
        ? <GeneratePlanCard onGenerate={handleGeneratePlan} canGenerate={isOnline} />
        : <PlaceHolder image={images.dietPlanNonePast} message="There's no meal plan for this day." />;
    }

    return (
      <FlatList
        data={meals}
        keyExtractor={keyExtractor}
        renderItem={renderMeal}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="mb-4 font-display text-lg text-foreground">No meals yet</Text>
            <Button title="Generate plan" onPress={handleGenerateNewPlan} loading={isRegenerating} />
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        initialNumToRender={3}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    );
  })();

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background px-3" edges={["top"]}>
        <GlobalHeader />
        <DaySelector
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          showDate={false}
          showButton={false}
        />
        {body}
      </SafeAreaView>
    </>
  );
}
