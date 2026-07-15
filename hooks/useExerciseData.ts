import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { ExerciseLog as Exercise, METValues , ExerciseIntensity } from '@/types/type';
import { EXERCISE_ICONS } from '@/constants/exercise';
import { fetchApi } from "@/lib/fetchApi";

const fetchMETValues = async (): Promise<METValues> => {
    return await fetchApi('/api/exercise-logs/types', {
        method: "GET",
        requiresAuth: true
    });
};

export const useExerciseData = () => {
    const [exerciseData, setExerciseData] = useState<Exercise[]>([]);

    const { data: metValues, isLoading, error } = useQuery({
        queryKey: ['met-values'],
        queryFn: fetchMETValues,
    });

    const calculateCalories = (
        exerciseName: string,
        durationMinutes: number,
        intensity: ExerciseIntensity
    ): number => {
        if (!metValues) return 0;

        const weightKg = 70; // Default weight
        const timeHours = durationMinutes / 60;

        const normalizedExercise = exerciseName.toLowerCase().trim();
        const intensityMap = metValues[normalizedExercise] || metValues["default"];

        if (!intensityMap) return 0;

        const metValue = intensityMap[intensity] || 5.0;
        return Math.round(metValue * weightKg * timeHours);
    };

    useEffect(() => {
        if (metValues) {
            const exercises: Exercise[] = Object.keys(metValues)
                .filter(key => key !== "default")
                .map((exerciseName, index) => ({
                    id: index + 1,
                    exerciseName: exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1),
                    intensity: "MODERATE" as ExerciseIntensity,
                    durationMinutes: 30,
                    caloriesBurned: calculateCalories(exerciseName, 30, "MODERATE")
                })) as Exercise[];

            setExerciseData(exercises);
        }
    }, [metValues]);


    const updateExercise = (
        exerciseId: number,
        intensity: ExerciseIntensity,
        duration: number
    ) => {
        const updatedExercises = exerciseData.map((exercise) =>
            exercise.id === exerciseId
                ? {
                    ...exercise,
                    intensity,
                    durationMinutes: duration,
                    caloriesBurned: calculateCalories(
                        exercise.exerciseName.toLowerCase(),
                        duration,
                        intensity
                    ),
                }
                : exercise
        );

        setExerciseData(updatedExercises);
    };

    return {
        exerciseData,
        metValues,
        isLoading,
        error,
        calculateCalories,
        updateExercise
    };
};