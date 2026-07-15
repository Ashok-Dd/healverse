import { ExerciseCard } from "@/components/cards/ExerciseCard";
import { ErrorState } from "@/components/ErrorState";
import { BottomSection } from "@/components/ExerciseDataBottom";
import ScreenHeader from "@/components/headers/ScreenHeader";
import { ExerciseModal } from "@/components/models/ExerciseModel";
import { ExerciseDataSkeleton } from "@/components/skeleton/ExerciseDataSkeleton";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useExerciseData } from "@/hooks/useExerciseData";
import {
  useDateSelectorForHealthStore,
  useExerciseLogMutations,
} from "@/store/healthStore";
import {
  CreateExerciseLogData,
  ExerciseLog as Exercise,
  ExerciseIntensity,
} from "@/types/type";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExerciseLogScreen: React.FC = () => {
  const { selectedDate } = useDateSelectorForHealthStore();

  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentOpenedModal, setCurrentOpenModal] = useState<Exercise | null>(
    null
  );
  const [selectedIntensity, setSelectedIntensity] =
    useState<ExerciseIntensity>("MODERATE");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const { exerciseData, isLoading, error, calculateCalories, updateExercise } =
    useExerciseData();

  const { addExerciseLog } = useExerciseLogMutations(selectedDate);

  const currentTime = useCurrentTime();

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

  const getTotalCalories = () => {
    if (!selectedExercise) return 0;
    const exercise = exerciseData.find(
      (ex) => ex.id.toString() === selectedExercise
    );
    return exercise?.caloriesBurned || 0;
  };

  const openExerciseModal = (exercise: Exercise) => {
    setCurrentOpenModal(exercise);
    setSelectedIntensity(exercise.intensity);
    setSelectedDuration(exercise.durationMinutes);
    setOpenModal(true);
  };

  const handleModalSave = () => {
    if (!currentOpenedModal) return;

    updateExercise(currentOpenedModal.id, selectedIntensity, selectedDuration);
    setOpenModal(false);
  };

  const handleSubmit = () => {
    if (selectedExercise) {
      // console.log("Exercise logged:", selectedExercise);

      // console.log(exerciseData)

      const exercise: Exercise | undefined = exerciseData.find(
        (f) => f.id === Number(selectedExercise)
      );

      // console.log("Mutating : " , exercise);
      if (exercise) {
        addExerciseLog.mutate(
          {
            exerciseName: exercise.exerciseName,
            durationMinutes: exercise.durationMinutes,
            intensity: exercise.intensity,
            loggedAt: new Date().toISOString(),
            caloriesBurned: exercise.caloriesBurned,
          } as CreateExerciseLogData,
          {
            onSettled: () => {
              router.back();
            },
          }
        );
      } else {
        // console.log("Select valid excercise");
      }
    }
  };

  // console.log(selectedExercise);

  if (isLoading) return <ExerciseDataSkeleton />;
  if (error) return <ErrorState />;

  return (
    <SafeAreaView className="flex-1 px-2 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScreenHeader
        title="Add Exercise Log"
        iconName="plus-circle"
        onPress={() => {}}
      />

      <View className="flex-1 py-4">
        <FlatList
          data={exerciseData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              isSelected={selectedExercise === item.id.toString()}
              onSelect={handleExerciseSelect}
              onEditPress={openExerciseModal}
            />
          )}
        />
      </View>

      <BottomSection
        currentTime={currentTime}
        totalCalories={getTotalCalories()}
        selectedExercise={selectedExercise}
        onSubmit={handleSubmit}
        isPending={addExerciseLog.isPending}
      />

      <ExerciseModal
        visible={openModal}
        exercise={currentOpenedModal}
        selectedIntensity={selectedIntensity}
        selectedDuration={selectedDuration}
        calculatedCalories={
          currentOpenedModal
            ? calculateCalories(
                currentOpenedModal.exerciseName.toLowerCase(),
                selectedDuration,
                selectedIntensity
              )
            : 0
        }
        onIntensityChange={setSelectedIntensity}
        onDurationChange={setSelectedDuration}
        onSave={handleModalSave}
        onCancel={() => setOpenModal(false)}
      />
    </SafeAreaView>
  );
};

export default ExerciseLogScreen;
