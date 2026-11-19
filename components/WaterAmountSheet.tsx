import { Button } from "@/components/ui/Button";
import { SheetModal } from "@/components/ui/SheetModal";
import { useThemeColors } from "@/constants/theme";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

interface WaterAmountSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  /** Amount the field starts with, in mL (editing an entry). */
  initialAmount?: number;
  onSubmit: (amountMl: number) => void;
  /** Water already logged today, in mL. */
  currentIntake?: number;
  /** Daily goal in mL. Without one the progress card is hidden. */
  dailyGoal?: number;
}

const PRESETS = [
  { label: "Glass", amount: 250 },
  { label: "Bottle", amount: 500 },
  { label: "Large bottle", amount: 750 },
  { label: "Liter", amount: 1000 },
];

export const WaterAmountSheet: React.FC<WaterAmountSheetProps> = ({
  visible,
  onClose,
  title,
  submitLabel,
  initialAmount,
  onSubmit,
  currentIntake = 0,
  dailyGoal = 0,
}) => {
  const colors = useThemeColors();
  const [waterAmount, setWaterAmount] = useState(initialAmount ? String(initialAmount) : "");

  const amount = parseInt(waterAmount, 10);
  const canSave = !isNaN(amount) && amount > 0;

  const handleClose = () => {
    setWaterAmount(initialAmount ? String(initialAmount) : "");
    onClose();
  };

  const save = () => {
    onSubmit(amount);
    handleClose();
  };

  const handleSave = () => {
    if (amount > 5000) {
      Alert.alert("Large amount", "That's a lot of water. Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, log it", onPress: save },
      ]);
      return;
    }
    save();
  };

  const progress = dailyGoal > 0 ? Math.min((currentIntake / dailyGoal) * 100, 100) : 0;
  const remaining = Math.max(dailyGoal - currentIntake, 0);

  return (
    <SheetModal
      visible={visible}
      onClose={handleClose}
      icon="water-outline"
      title={title}
      subtitle="Stay hydrated through the day"
      footer={
        <>
          <Button title="Cancel" variant="outline" className="flex-1" onPress={handleClose} />
          <Button title={submitLabel} className="flex-1" disabled={!canSave} onPress={handleSave} />
        </>
      }
    >
      {dailyGoal > 0 && (
        <View className="mb-5 rounded-2xl bg-muted p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-body-semibold text-sm text-foreground">Today</Text>
            <Text className="font-body-semibold text-sm text-foreground">
              {currentIntake} / {dailyGoal} mL
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-border">
            <View className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </View>
          <Text className="mt-2 font-body text-xs text-muted-foreground">
            {remaining > 0 ? `${remaining} mL to reach your goal` : "Daily goal reached"}
          </Text>
        </View>
      )}

      <Text className="mb-2 font-body-bold text-xs uppercase tracking-wide text-muted-foreground">
        Quick add
      </Text>
      <View className="mb-5 flex-row flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const selected = amount === preset.amount;
          return (
            <Pressable
              key={preset.amount}
              onPress={() => setWaterAmount(String(preset.amount))}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${preset.label}, ${preset.amount} millilitres`}
              className={`min-h-[56px] w-[48%] justify-center rounded-2xl border px-4 py-2 active:opacity-80 ${
                selected ? "border-primary bg-secondary" : "border-border bg-background"
              }`}
            >
              <Text className="font-body-semibold text-base text-foreground">
                {preset.amount} mL
              </Text>
              <Text className="font-body text-xs text-muted-foreground">{preset.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mb-2 font-body-bold text-xs uppercase tracking-wide text-muted-foreground">
        Custom amount
      </Text>
      <View className="min-h-[56px] flex-row items-center rounded-2xl border border-border bg-background px-4">
        <TextInput
          className="flex-1 font-body text-lg text-foreground"
          placeholder="Enter amount"
          placeholderTextColor={colors.mutedForeground}
          value={waterAmount}
          onChangeText={setWaterAmount}
          keyboardType="number-pad"
          maxLength={4}
          accessibilityLabel="Custom water amount in millilitres"
        />
        <Text className="font-body-semibold text-base text-muted-foreground">mL</Text>
      </View>
    </SheetModal>
  );
};
