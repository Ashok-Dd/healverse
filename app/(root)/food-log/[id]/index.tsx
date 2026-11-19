import ErrorCard from "@/components/cards/ErrorCard";
import FoodItemCard from "@/components/cards/FoodItemCard";
import { FoodItemEditor } from "@/components/food/FoodItemEditor";
import { BackHeader } from "@/components/headers/BackHeader";
import { Button } from "@/components/ui/Button";
import { MealPhoto } from "@/components/ui/MealPhoto";
import NutrientBadge from "@/components/ui/NutritionBadge";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { useThemeColors } from "@/constants/theme";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { parseServerTime } from "@/lib/day";
import {
  draftFromItem,
  emptyDraft,
  type ItemDraft,
  MAX_ITEMS,
  MAX_MEAL_NAME_LENGTH,
  MEAL_TYPE_OPTIONS,
  toPayload,
  validateDrafts,
} from "@/lib/foodEdit";
import { deleteMealPhoto } from "@/lib/mealPhotos";
import { useIsOnline } from "@/lib/network";
import { calculateTotals } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useFoodLogMutations, useFoodLogs } from "@/store/healthStore";
import type { FoodLog, MealType } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Draft {
  mealType: MealType;
  mealName: string;
  items: ItemDraft[];
}

const mealTypeLabel = (mealType: MealType) =>
  MEAL_TYPE_OPTIONS.find((option) => option.value === mealType)?.label ?? mealType;

function IconAction({
  icon,
  label,
  onPress,
  disabled,
  destructive,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`h-11 w-11 items-center justify-center rounded-full border border-border bg-card active:opacity-70 ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        className={destructive ? "text-destructive" : "text-foreground"}
      />
    </Pressable>
  );
}

const FoodLogScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const logId = Number(id);
  const colors = useThemeColors();
  const isOnline = useIsOnline();
  const userId = useAuthStore((state) => state.user?.id);
  const keyboardHeight = useKeyboardHeight();
  const { data: log, isLoading, error, refetch } = useFoodLogs.ById(logId);
  const { updateFoodLog, deleteFoodLog } = useFoodLogMutations();

  const [draft, setDraft] = useState<Draft | null>(null);
  const nextKey = useRef(0);
  const newKey = useCallback(() => `item-${nextKey.current++}`, []);

  const startEdit = (current: FoodLog) =>
    setDraft({
      mealType: current.mealType,
      mealName: current.mealName ?? "",
      items: current.items.map((item) => draftFromItem(item, newKey())),
    });

  const changeItem = useCallback((changed: ItemDraft) => {
    setDraft((prev) =>
      prev ? { ...prev, items: prev.items.map((item) => (item.key === changed.key ? changed : item)) } : prev
    );
  }, []);

  const removeItem = (key: string) =>
    setDraft((prev) => (prev ? { ...prev, items: prev.items.filter((item) => item.key !== key) } : prev));

  const addItem = () =>
    setDraft((prev) => (prev ? { ...prev, items: [...prev.items, emptyDraft(newKey())] } : prev));

  const save = () => {
    if (!draft || !log) return;
    const problem = validateDrafts(draft.items);
    if (problem) {
      Alert.alert("Check the meal", problem);
      return;
    }
    updateFoodLog.mutate(
      { id: log.id, payload: toPayload(draft.mealType, draft.mealName, draft.items) },
      { onSuccess: () => setDraft(null) }
    );
  };

  const confirmDelete = () => {
    if (!log) return;
    Alert.alert("Delete this meal?", log.mealName || mealTypeLabel(log.mealType), [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteFoodLog.mutate(log, {
            onSuccess: () => {
              if (userId != null) void deleteMealPhoto(userId, log.id);
              router.back();
            },
          }),
      },
    ]);
  };

  const editing = draft !== null;
  const header = (
    <BackHeader
      title={editing ? "Edit meal" : "Meal"}
      right={
        log && !editing ? (
          <View className="flex-row gap-2">
            <IconAction icon="pencil-outline" label="Edit meal" onPress={() => startEdit(log)} disabled={!isOnline} />
            <IconAction
              icon="trash-can-outline"
              label="Delete meal"
              onPress={confirmDelete}
              disabled={!isOnline}
              destructive
            />
          </View>
        ) : undefined
      }
    />
  );

  if (!log) {
    return (
      <>
        <ThemedStatusBar />
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
          {header}
          <View className="px-3">
            {isLoading ? (
              <View className="h-56 animate-pulse rounded-3xl bg-muted" accessibilityLabel="Loading meal" />
            ) : (
              <ErrorCard
                message={error ? error.message : "This meal could not be found."}
                onPress={() => refetch()}
                className="mx-0"
              />
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }

  const totals = calculateTotals(log.items);

  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
        {header}
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 px-3"
          contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 24 : 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!isOnline && (
            <Text className="px-1 font-body text-xs text-muted-foreground">
              Editing and deleting a meal need an internet connection.
            </Text>
          )}

          {draft ? (
            <>
              <View className="gap-3 rounded-3xl border border-border bg-card p-4">
                <View>
                  <Text className="mb-1 font-body-semibold text-xs text-muted-foreground">Meal name</Text>
                  <TextInput
                    className="min-h-[48px] rounded-2xl border border-border bg-background px-3 font-body text-base text-foreground"
                    value={draft.mealName}
                    onChangeText={(mealName) => setDraft({ ...draft, mealName })}
                    placeholder={log.mealName}
                    placeholderTextColor={colors.mutedForeground}
                    maxLength={MAX_MEAL_NAME_LENGTH}
                    accessibilityLabel="Meal name"
                  />
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {MEAL_TYPE_OPTIONS.map((option) => {
                    const selected = option.value === draft.mealType;
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => setDraft({ ...draft, mealType: option.value })}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        accessibilityLabel={option.label}
                        className={`min-h-[40px] justify-center rounded-full border px-4 active:opacity-80 ${
                          selected ? "border-primary bg-primary" : "border-border bg-background"
                        }`}
                      >
                        <Text
                          className={`font-body-semibold text-sm ${
                            selected ? "text-primary-foreground" : "text-foreground"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {draft.items.map((item) => (
                <FoodItemEditor
                  key={item.key}
                  draft={item}
                  onChange={changeItem}
                  onRemove={draft.items.length > 1 ? () => removeItem(item.key) : undefined}
                />
              ))}

              {draft.items.length < MAX_ITEMS && (
                <Button title="Add an item" variant="soft" size="sm" onPress={addItem} />
              )}

              <View className="flex-row gap-3 pt-2">
                <Button
                  title="Cancel"
                  variant="outline"
                  className="flex-1"
                  disabled={updateFoodLog.isPending}
                  onPress={() => setDraft(null)}
                />
                <Button title="Save" className="flex-1" loading={updateFoodLog.isPending} onPress={save} />
              </View>
            </>
          ) : (
            <>
              <MealPhoto
                logId={log.id}
                imageUrl={log.imageUrl}
                className="h-56 w-full rounded-3xl"
                iconSize={56}
              />

              <View className="gap-1 rounded-3xl border border-border bg-card p-4">
                <Text className="font-display text-xl text-foreground">
                  {log.mealName || mealTypeLabel(log.mealType)}
                </Text>
                <Text className="font-body text-sm text-muted-foreground">
                  {mealTypeLabel(log.mealType)} · {parseServerTime(log.loggedAt).toLocaleString()}
                </Text>
                <View className="mt-2 flex-row flex-wrap gap-1">
                  <NutrientBadge iconName="fire" value={totals.calories} unit="kcal" tone="destructive" />
                  <NutrientBadge iconName="food-drumstick" value={totals.protein} unit="g" tone="info" />
                  <NutrientBadge iconType="Entypo" iconName="drop" value={totals.fat} unit="g" tone="warning" />
                  <NutrientBadge iconName="leaf" value={totals.carbs} unit="g" tone="success" />
                </View>
              </View>

              <Text accessibilityRole="header" className="px-1 pt-1 font-display text-lg text-foreground">
                Items
              </Text>
              {log.items.map((item) => (
                <FoodItemCard
                  key={item.id}
                  name={item.name}
                  quantity={item.quantity}
                  unit={item.unit}
                  calories={item.calories}
                  protein={item.protein}
                  fat={item.fat}
                  carbs={item.carbs}
                />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default FoodLogScreen;
