import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {ExerciseIntensity, ExerciseLog} from "@/types/type";
import {
    useDashboardData,
    useDateSelectorForHealthStore, useExerciseLogMutations,
} from "@/store/healthStore";
import { ExerciseModal } from "@/components/models/ExerciseModel";

const AllLoggedExercises: React.FC = () => {
    const { selectedDate } = useDateSelectorForHealthStore();
    const { isLoading, getExerciseLogs } = useDashboardData(selectedDate);

    const {
        updateExerciseLog,
        deleteExerciseLog
    } = useExerciseLogMutations()

    const loggedExercises = getExerciseLogs();

    // menu state
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
        null
    );
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    // update modal state
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateExercise, setUpdateExercise] = useState<ExerciseLog | null>(null);

    // delete modal state
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleMenuPress = (exerciseId: number, event: any) => {
        setSelectedExerciseId(exerciseId);
        const { pageX, pageY } = event.nativeEvent;
        setMenuPosition({ x: pageX - 100, y: pageY + 10 });
        setMenuVisible(true);
    };

    const handleEdit = () => {
        const exercise = loggedExercises.find((e) => e.id === selectedExerciseId);
        if (exercise) {
            setUpdateExercise(exercise);
            setUpdateModalVisible(true);
        }
        setMenuVisible(false);
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
        setMenuVisible(false);
    };

    const handleConfirmDelete = () => {
        console.log("Deleting exercise:", selectedExerciseId);
        deleteExerciseLog.mutate(selectedExerciseId!)
        setDeleteModalVisible(false);
        setSelectedExerciseId(null);
    };

    const handleSaveUpdate = async  (updatedData: {
        intensity: ExerciseIntensity;
        durationMinutes: number;
    }) => {
        console.log("Updating exercise:", updateExercise?.id, updatedData);
        updateExerciseLog.mutate({
            id : updateExercise?.id!,
            updates : {
                exerciseName : updateExercise?.exerciseName,
                durationMinutes : updatedData?.durationMinutes,
                intensity : updatedData.intensity,
            }
        })
        setUpdateModalVisible(false);
        setUpdateExercise(null);
    };

    const renderExerciseItem = (exercise: ExerciseLog) => (
        <View key={exercise.id} className="mb-6">
            <View className="mx-4 bg-gray-50 rounded-2xl p-4">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                        <Text className="text-2xl">🏋️</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800 mb-1">
                            {exercise.exerciseName} | {exercise.intensity} |{" "}
                            {exercise.durationMinutes} min
                        </Text>

                        <View className="flex-row items-center mb-2">
                            <Ionicons name="walk" size={16} color="#9ca3af" />
                            <Text className="text-gray-500 ml-2">
                                Exercise {exercise.loggedAt}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons name="flame" size={16} color="#10b981" />
                            <Text className="text-green-600 font-medium ml-1">
                                -{exercise.caloriesBurned}kcal
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="p-2"
                        onPress={(event) => handleMenuPress(exercise.id, event)}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="">
            {isLoading && (
                <Text className="text-center text-gray-500">Loading...</Text>
            )}

            {!isLoading && loggedExercises.length > 0 && (
                <>
                    {loggedExercises.map((exercise) => renderExerciseItem(exercise))}
                </>
            )}

            {!isLoading && loggedExercises.length === 0 && (
                <View className="flex-1 justify-center items-center mt-10">
                    <Ionicons name="fitness" size={32} color="#2196F3" />
                    <Text className="mt-2 text-gray-500">No exercises logged</Text>
                </View>
            )}

            {/* Menu Modal */}
            <Modal
                transparent
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
                animationType="none"
            >
                <Pressable className="flex-1" onPress={() => setMenuVisible(false)}>
                    <View
                        className="absolute bg-white rounded-xl w-32 py-1 shadow-2xl border border-gray-100"
                        style={{
                            top: menuPosition.y,
                            right: 20,
                            elevation: 10,
                        }}
                    >
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={handleEdit}
                        >
                            <Text className="text-base text-gray-800 font-normal">Edit</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-gray-150 mx-0" />

                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={handleDelete}
                        >
                            <Text className="text-base text-gray-800 font-normal">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Update Modal */}
            {updateExercise && (
                <ExerciseModal
                    visible={updateModalVisible}
                    exercise={updateExercise}
                    selectedIntensity={updateExercise.intensity}
                    selectedDuration={updateExercise.durationMinutes}
                    calculatedCalories={updateExercise.caloriesBurned}
                    onIntensityChange={(newIntensity) =>
                        setUpdateExercise((prev) =>
                            prev ? { ...prev, intensity: newIntensity } : prev
                        )
                    }
                    onDurationChange={(newDuration) =>
                        setUpdateExercise((prev) =>
                            prev ? { ...prev, durationMinutes: newDuration } : prev
                        )
                    }
                    onSave={() =>
                        handleSaveUpdate({
                            intensity: updateExercise?.intensity!,
                            durationMinutes: updateExercise?.durationMinutes!,
                        })
                    }
                    onCancel={() => {
                        setUpdateModalVisible(false);
                        setUpdateExercise(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                transparent
                visible={deleteModalVisible}
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/40 items-center justify-center"
                    onPress={() => setDeleteModalVisible(false)}
                >
                    <View className="bg-white p-6 rounded-xl w-80">
                        <Text className="text-lg font-semibold mb-4">
                            Delete this exercise?
                        </Text>
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                className="px-4 py-2 mr-2"
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text className="text-gray-600">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2 bg-red-500 rounded"
                                onPress={handleConfirmDelete}
                            >
                                <Text className="text-white">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default AllLoggedExercises;
