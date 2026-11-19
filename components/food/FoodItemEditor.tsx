import { useThemeColors } from "@/constants/theme";
import { FOOD_UNITS, type ItemDraft, withMacro, withQuantity } from "@/lib/foodEdit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface FoodItemEditorProps {
  draft: ItemDraft;
  onChange: (draft: ItemDraft) => void;
  /** Absent when this is the only item: a meal keeps at least one. */
  onRemove?: () => void;
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  suffix?: string;
  numeric?: boolean;
  className?: string;
}

function Field({ label, value, onChangeText, suffix, numeric = true, className = "" }: FieldProps) {
  const colors = useThemeColors();
  return (
    <View className={className}>
      <Text className="mb-1 font-body-semibold text-xs text-muted-foreground">{label}</Text>
      <View className="min-h-[48px] flex-row items-center rounded-2xl border border-border bg-background px-3">
        <TextInput
          className="flex-1 py-2 font-body text-base text-foreground"
          value={value}
          onChangeText={onChangeText}
          keyboardType={numeric ? "decimal-pad" : "default"}
          placeholderTextColor={colors.mutedForeground}
          maxLength={numeric ? 8 : 100}
          accessibilityLabel={label}
          selectTextOnFocus
        />
        {suffix ? <Text className="font-body text-sm text-muted-foreground">{suffix}</Text> : null}
      </View>
    </View>
  );
}

/** Edits one food item: name, amount with unit, and calories and macros (rescaled when the amount changes). */
export const FoodItemEditor = React.memo(function FoodItemEditor({
  draft,
  onChange,
  onRemove,
}: FoodItemEditorProps) {
  const units: readonly string[] = FOOD_UNITS.some((unit) => unit === draft.unit)
    ? FOOD_UNITS
    : [draft.unit, ...FOOD_UNITS];

  return (
    <View className="gap-3 rounded-3xl border border-border bg-card p-4">
      <View className="flex-row items-end gap-2">
        <Field
          label="Food"
          value={draft.name}
          onChangeText={(name) => onChange({ ...draft, name })}
          numeric={false}
          className="flex-1"
        />
        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${draft.name || "item"}`}
            className="h-12 w-12 items-center justify-center rounded-full active:opacity-70"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={22} className="text-destructive" />
          </Pressable>
        )}
      </View>

      <Field
        label="Amount"
        value={draft.quantity}
        onChangeText={(quantity) => onChange(withQuantity(draft, quantity))}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="flex-row gap-2">
          {units.map((unit) => {
            const selected = unit === draft.unit;
            return (
              <Pressable
                key={unit}
                onPress={() => onChange({ ...draft, unit })}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={unit}
                className={`min-h-[40px] justify-center rounded-full border px-4 active:opacity-80 ${
                  selected ? "border-primary bg-primary" : "border-border bg-background"
                }`}
              >
                <Text
                  className={`font-body-semibold text-sm ${
                    selected ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {unit}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="flex-row gap-2">
        <Field
          label="Calories"
          suffix="kcal"
          value={draft.calories}
          onChangeText={(value) => onChange(withMacro(draft, "calories", value))}
          className="flex-1"
        />
        <Field
          label="Protein"
          suffix="g"
          value={draft.protein}
          onChangeText={(value) => onChange(withMacro(draft, "protein", value))}
          className="flex-1"
        />
      </View>
      <View className="flex-row gap-2">
        <Field
          label="Fat"
          suffix="g"
          value={draft.fat}
          onChangeText={(value) => onChange(withMacro(draft, "fat", value))}
          className="flex-1"
        />
        <Field
          label="Carbs"
          suffix="g"
          value={draft.carbs}
          onChangeText={(value) => onChange(withMacro(draft, "carbs", value))}
          className="flex-1"
        />
      </View>
    </View>
  );
});
