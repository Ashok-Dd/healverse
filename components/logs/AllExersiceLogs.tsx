import { ExerciseModal } from "@/components/models/ExerciseModel";
import Skeleton from "@/components/skeleton/Skeleton";
import InlineError from "@/components/ui/InlineError";
import { SyncBadge } from "@/components/ui/SyncBadge";
import { useExerciseData } from "@/hooks/useExerciseData";
import { parseServerTime } from "@/lib/day";
import { useIsOnline } from "@/lib/network";
import { useExerciseLogMutations, useExerciseLogs } from "@/store/healthStore";
import { ExerciseLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

/** Every exercise entry of one day, with edit and delete (both need a connection). */
const AllLoggedExercises = ({ date }: { date: string }) => {
  const isOnline = useIsOnline();
  const { isLoading, error, data: loggedExercises, refetch } = useExerciseLogs.ByDate(date);
  const { updateExerciseLog, deleteExerciseLog } = useExerciseLogMutations(date);
  const { calculateCalories } = useExerciseData();

  const [editing, setEditing] = useState<ExerciseLog | null>(null);

  const confirmDelete = (exercise: ExerciseLog) => {
    Alert.alert("Delete this exercise?", exercise.exerciseName, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        // A failure is reported by the global mutation error toast (lib/react-query-client.ts).
        onPress: () => deleteExerciseLog.mutate(exercise.id),
      },
    ]);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateExerciseLog.mutate(
      {
        id: editing.id,
        updates: {
          exerciseName: editing.exerciseName,
          durationMinutes: editing.durationMinutes,
          intensity: editing.intensity,
        },
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  if (isLoading) {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Skeleton height={64} radius={16} width="100%" className="mb-2" />
        <Skeleton height={64} radius={16} width="100%" />
      </View>
    );
  }

  if (error && !loggedExercises) {
    return <InlineError message="Couldn't load your exercises." onRetry={() => refetch()} />;
  }

  if (!loggedExercises?.length) {
    return (
      <View className="min-h-[72px] items-center justify-center rounded-2xl border border-dashed border-border px-4 py-3">
        <Text className="text-center font-body text-sm text-muted-foreground">
          No exercise logged on this day.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {!isOnline && (
        <Text className="px-1 font-body text-xs text-muted-foreground">
          Editing and deleting need an internet connection.
        </Text>
      )}

      {loggedExercises.map((exercise) => {
        const deleting = deleteExerciseLog.isPending && deleteExerciseLog.variables === exercise.id;
        const canChange = isOnline && !exercise.outboxStatus && !deleteExerciseLog.isPending;
        return (
          <View
            key={exercise.id}
            className={`flex-row items-center gap-3 rounded-2xl bg-muted p-3 ${
              deleting ? "opacity-50" : ""
            }`}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent">
              <MaterialCommunityIcons name="dumbbell" size={20} className="text-accent-foreground" />
            </View>

            <View className="flex-1">
              <Text className="font-body-bold text-sm text-foreground" numberOfLines={1}>
                {exercise.exerciseName}
              </Text>
              <Text className="font-body text-xs text-muted-foreground">
                {exercise.durationMinutes} min · {exercise.intensity.toLowerCase()} ·{" "}
                {parseServerTime(exercise.loggedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons name="fire" size={14} className="text-destructive" />
                <Text className="font-body-semibold text-xs text-destructive">
                  {exercise.caloriesBurned} kcal
                </Text>
              </View>
              <SyncBadge status={exercise.outboxStatus} />
            </View>

            {!exercise.outboxStatus && (
              <View className="flex-row">
                <Pressable
                  onPress={() => setEditing(exercise)}
                  disabled={!canChange}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${exercise.exerciseName}`}
                  className={`h-11 w-11 items-center justify-center rounded-full active:opacity-70 ${
                    canChange ? "" : "opacity-40"
                  }`}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={20} className="text-foreground" />
                </Pressable>
                <Pressable
                  onPress={() => confirmDelete(exercise)}
                  disabled={!canChange}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${exercise.exerciseName}`}
                  className={`h-11 w-11 items-center justify-center rounded-full active:opacity-70 ${
                    canChange ? "" : "opacity-40"
                  }`}
                >
                  {deleting ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <MaterialCommunityIcons name="trash-can-outline" size={20} className="text-destructive" />
                  )}
                </Pressable>
              </View>
            )}
          </View>
        );
      })}

      {editing && (
        <ExerciseModal
          visible
          exercise={editing}
          selectedIntensity={editing.intensity}
          selectedDuration={editing.durationMinutes}
          calculatedCalories={calculateCalories(
            editing.exerciseName,
            editing.durationMinutes,
            editing.intensity
          )}
          onIntensityChange={(intensity) => setEditing({ ...editing, intensity })}
          onDurationChange={(durationMinutes) => setEditing({ ...editing, durationMinutes })}
          onSave={saveEdit}
          onCancel={() => setEditing(null)}
          saving={updateExerciseLog.isPending}
        />
      )}
    </View>
  );
};

export default AllLoggedExercises;
