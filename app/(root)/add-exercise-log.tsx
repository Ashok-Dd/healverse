import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {CreateExerciseLogData, ExerciseIntensity} from "@/types/type";
import { ExerciseLog as Exercise } from '@/types/type';
import { HeaderComponent } from '@/components/headers/ExerciseHeader';
import { ExerciseCard } from '@/components/cards/ExerciseCard';
import {useExerciseData} from "@/hooks/useExerciseData";
import {useCurrentTime} from "@/hooks/useCurrentTime";
import {ExerciseModal} from "@/components/models/ExerciseModel";
import {ErrorState} from "@/components/ErrorState";
import {ExerciseDataSkeleton} from "@/components/skeleton/ExerciseDataSkeleton";
import {BottomSection} from "@/components/ExerciseDataBottom";
import {useExerciseLogMutations} from "@/store/healthStore";


const ExerciseLogScreen: React.FC = () => {
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentOpenedModal, setCurrentOpenModal] = useState<Exercise | null>(null);
    const [selectedIntensity, setSelectedIntensity] = useState<ExerciseIntensity>("MODERATE");
    const [selectedDuration, setSelectedDuration] = useState<number>(30);

    const {
        exerciseData,
        isLoading,
        error,
        calculateCalories,
        updateExercise
    } = useExerciseData();

    const {
        addExerciseLog
    } = useExerciseLogMutations()

    const currentTime = useCurrentTime();

    const handleExerciseSelect = (exerciseId: string) => {
        setSelectedExercise(exerciseId);
    };

    const getTotalCalories = () => {
        if (!selectedExercise) return 0;
        const exercise = exerciseData.find((ex) => ex.id.toString() === selectedExercise);
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
            console.log("Exercise logged:", selectedExercise);

            console.log(exerciseData)

            const exercise: Exercise | undefined = exerciseData.find(
                (f) => f.id === Number(selectedExercise)
            );

            console.log("Mutating : " , exercise);
            if(exercise) {
                addExerciseLog.mutate({
                    exerciseName : exercise.exerciseName,
                    durationMinutes : exercise.durationMinutes,
                    intensity : exercise.intensity,
                    loggedAt : new Date().toISOString(),
                    caloriesBurned : exercise.caloriesBurned,
                } as CreateExerciseLogData)
            }else {
                console.log("Select valid excercise");
            }
        }
    };

    console.log(selectedExercise);

    if (isLoading) return <ExerciseDataSkeleton />;
    if (error) return <ErrorState />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <HeaderComponent />

            <ScrollView className="flex-1 py-4">
                {exerciseData.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isSelected={selectedExercise === exercise.id.toString()}
                        onSelect={handleExerciseSelect}
                        onEditPress={openExerciseModal}
                    />
                ))}
            </ScrollView>

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