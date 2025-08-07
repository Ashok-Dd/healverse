import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Exercise {
  id: string;
  name: string;
  icon: string;
  calories: number;
  duration: number;
  intensity: string;
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Walking",
    icon: "walk",
    calories: 146,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "2",
    name: "Running",
    icon: "walk  ",
    calories: 272,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "3",
    name: "Cycling",
    icon: "bicycle",
    calories: 334,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "4",
    name: "Weight Lifting",
    icon: "barbell",
    calories: 208,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "5",
    name: "Yoga",
    icon: "body",
    calories: 167,
    duration: 60,
    intensity: "Moderate",
  },
  {
    id: "6",
    name: "Swimming",
    icon: "water",
    calories: 334,
    duration: 45,
    intensity: "Moderate",
  },
  {
    id: "7",
    name: "Elliptical",
    icon: "fitness",
    calories: 222,
    duration: 40,
    intensity: "Moderate",
  },
  {
    id: "8",
    name: "Bodyweight Exercises",
    icon: "person",
    calories: 139,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "9",
    name: "Rowing",
    icon: "boat",
    calories: 167,
    duration: 30,
    intensity: "Moderate",
  },
  {
    id: "10",
    name: "Jumping Rope",
    icon: "flash",
    calories: 139,
    duration: 15,
    intensity: "Moderate",
  },
  {
    id: "11",
    name: "Dancing",
    icon: "musical-notes",
    calories: 229,
    duration: 45,
    intensity: "Moderate",
  },
];

const intensityLevels = [
  { level: "Low", color: "#10b981", calories: 0.7 },
  { level: "Moderate", color: "#3b82f6", calories: 1.0 },
  { level: "High", color: "#f59e0b", calories: 1.3 },
  { level: "Very High", color: "#ef4444", calories: 1.6 },
];

const ITEM_HEIGHT = 50;
const PICKER_HEIGHT = 200;

// Generate duration options from 5 to 300 minutes in 5-minute increments
const DURATION_OPTIONS = Array.from({ length: 60 }, (_, i) => (i + 1) * 5);

const ExerciseLogScreen: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentOpenedModal, setCurrentOpenModal] = useState<Exercise | null>();
  const [exerciseData, setExerciseData] = useState<Exercise[]>(exercises);

  // Modal state
  const [selectedIntensity, setSelectedIntensity] =
    useState<string>("Moderate");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  // Refs for smooth scrolling
  const intensityScrollRef = useRef<FlatList>(null);
  const durationScrollRef = useRef<FlatList>(null);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

  const getTotalCalories = () => {
    if (!selectedExercise) return 0;
    const exercise = exerciseData.find((ex) => ex.id === selectedExercise);
    return exercise?.calories || 0;
  };

  const calculateCalories = (
    baseCalories: number,
    intensity: string,
    duration: number
  ) => {
    const intensityMultiplier =
      intensityLevels.find((i) => i.level === intensity)?.calories || 1;
    return Math.round((baseCalories * intensityMultiplier * duration) / 45);
  };

  const openExerciseModal = (exercise: Exercise) => {
    setCurrentOpenModal(exercise);
    setSelectedIntensity(exercise.intensity);
    setSelectedDuration(exercise.duration);
    setOpenModal(true);

    // Scroll to selected values after modal opens
    setTimeout(() => {
      const intensityIndex = intensityLevels.findIndex(
        (i) => i.level === exercise.intensity
      );
      const durationIndex = DURATION_OPTIONS.findIndex(
        (d) => d === exercise.duration
      );

      if (intensityIndex >= 0) {
        intensityScrollRef.current?.scrollToIndex({
          index: intensityIndex,
          animated: true,
        });
      }

      if (durationIndex >= 0) {
        durationScrollRef.current?.scrollToIndex({
          index: durationIndex,
          animated: true,
        });
      }
    }, 300);
  };

  const updateExercise = () => {
    if (!currentOpenedModal) return;

    const baseCalories =
      exercises.find((e) => e.id === currentOpenedModal.id)?.calories || 0;
    const newCalories = calculateCalories(
      baseCalories,
      selectedIntensity,
      selectedDuration
    );

    const updatedExercises = exerciseData.map((exercise) =>
      exercise.id === currentOpenedModal.id
        ? {
            ...exercise,
            intensity: selectedIntensity,
            duration: selectedDuration,
            calories: newCalories,
          }
        : exercise
    );

    setExerciseData(updatedExercises);
    setOpenModal(false);
  };

  const handleIntensityScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(
        0,
        Math.min(index, intensityLevels.length - 1)
      );
      const newIntensity = intensityLevels[clampedIndex]?.level;

      if (newIntensity && newIntensity !== selectedIntensity) {
        setSelectedIntensity(newIntensity);
      }
    },
    [selectedIntensity]
  );

  const handleDurationScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(
        0,
        Math.min(index, DURATION_OPTIONS.length - 1)
      );
      const newDuration = DURATION_OPTIONS[clampedIndex];

      if (newDuration && newDuration !== selectedDuration) {
        setSelectedDuration(newDuration);
      }
    },
    [selectedDuration]
  );

  const renderIntensityItem = ({
    item,
    index,
  }: {
    item: (typeof intensityLevels)[0];
    index: number;
  }) => {
    const isSelected = item.level === selectedIntensity;
    return (
      <TouchableOpacity
        style={{ height: ITEM_HEIGHT }}
        className="items-center justify-center px-2"
        onPress={() => {
          setSelectedIntensity(item.level);
          intensityScrollRef.current?.scrollToIndex({
            index,
            animated: true,
          });
        }}
      >
        <Text
          className={` ${
            isSelected
              ? "text-blue-600 text-sm font-semibold"
              : "text-gray-400 text-xs"
          }`}
        >
          {item.level}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDurationItem = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }) => {
    const isSelected = item === selectedDuration;
    return (
      <TouchableOpacity
        style={{ height: ITEM_HEIGHT }}
        className="items-center justify-center px-4"
        onPress={() => {
          setSelectedDuration(item);
          durationScrollRef.current?.scrollToIndex({
            index,
            animated: true,
          });
        }}
      >
        <Text
          className={`   ${
            isSelected
              ? "text-blue-600 font-semibold text-sm"
              : "text-gray-400 text-xs"
          }`}
        >
          {item} min
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSmoothIntensityPicker = () => (
    <View className="flex-1 mr-4">
      <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
        Intensity
      </Text>
      <View style={{ height: PICKER_HEIGHT }} className="relative">
        {/* Selection indicator
        <View
          className="absolute left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg z-0"
          style={{
            top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
            height: ITEM_HEIGHT,
          }}
        /> */}

        <FlatList
          ref={intensityScrollRef}
          data={intensityLevels}
          renderItem={renderIntensityItem}
          keyExtractor={(item) => item.level}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 3,
          }}
          onMomentumScrollEnd={handleIntensityScroll}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>
    </View>
  );

  const renderSmoothDurationPicker = () => (
    <View className="flex-1 ml-4">
      <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
        Duration
      </Text>
      <View style={{ height: PICKER_HEIGHT }} className="relative">
        {/* Selection indicator
        <View
          className="absolute left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg z-0"
          style={{
            top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
            height: ITEM_HEIGHT,
          }}
        /> */}

        <FlatList
          ref={durationScrollRef}
          data={DURATION_OPTIONS}
          renderItem={renderDurationItem}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 3,
          }}
          onMomentumScrollEnd={handleDurationScroll}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>
    </View>
  );

  const renderExerciseItem = (exercise: Exercise) => {
    const isSelected = selectedExercise === exercise.id;

    return (
      <TouchableOpacity
        key={exercise.id}
        className={`flex-row items-center p-4 mx-4 mb-2 rounded-xl ${
          isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"
        }`}
        onPress={() => handleExerciseSelect(exercise.id)}
      >
        <View
          className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
            isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>

        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
            <Ionicons name={exercise.icon as any} size={20} color="#6b7280" />
          </View>

          <View className="flex-1">
            <Text className="text-sm text-gray-800 mb-1">{exercise.name}</Text>
            <View className="flex-row items-center">
              <Ionicons name="flame" size={14} color="#10b981" />
              <Text className="text-xs text-green-600 ml-1">
                -{exercise.calories}kcal
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="flex flex-row gap-2 items-center"
            onPress={() => openExerciseModal(exercise)}
          >
            <Text className="text-blue-500 font-medium mb-1">
              {exercise.intensity}
            </Text>
            <Text className="text-blue-500 font-medium">
              {exercise.duration} min
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getExerciseDescription = (exerciseName: string) => {
    const descriptions: { [key: string]: string } = {
      Rowing:
        "A full-body cardio and strength workout that primarily targets your arms, back, and legs.",
      Running:
        "High-intensity cardiovascular exercise that burns calories efficiently and improves endurance.",
      Walking:
        "Low-impact cardiovascular exercise perfect for beginners and daily fitness maintenance.",
      Cycling:
        "Excellent lower body workout that builds leg strength while providing great cardio benefits.",
      Swimming:
        "Full-body, low-impact exercise that works all major muscle groups simultaneously.",
      Yoga: "Mind-body practice that improves flexibility, strength, and mental well-being.",
      "Weight Lifting":
        "Strength training that builds muscle mass and increases metabolic rate.",
      Dancing:
        "Fun cardiovascular workout that improves coordination and burns calories.",
      "Jumping Rope":
        "High-intensity cardio that improves coordination and burns calories quickly.",
    };
    return (
      descriptions[exerciseName] ||
      "Great exercise for overall fitness and health."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Ionicons name="walk" size={24} color="#374151" className="mr-2" />
          <Text className="text-lg font-semibold text-gray-800">
            Log Exercise
          </Text>
        </View>

        <TouchableOpacity className="bg-blue-200 px-3 py-1 rounded-full">
          <Text className="text-blue-500 text-xs">+ Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <ScrollView className="flex-1 py-4">
        {exerciseData.map(renderExerciseItem)}
      </ScrollView>

      {/* Bottom Section */}
      <View className="px-4 py-4 border-t flex-row justify-between items-center border-gray-100 bg-white">
        <View className="mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#6b7280" />
            <Text className="text-gray-600 ml-2">Today {currentTime}</Text>
            <TouchableOpacity className="ml-3">
              <Ionicons name="create-outline" size={15} color="skyblue" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="menu" size={20} color="#374151" />
              <Text className="text-gray-800 font-medium ml-2">
                Total: {getTotalCalories()}kcal
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className={`px-10 py-4 rounded-xl items-center justify-center ${
            selectedExercise ? "bg-green-500" : "bg-gray-300"
          }`}
          disabled={!selectedExercise}
          onPress={() => {
            if (selectedExercise) {
              console.log("Exercise logged:", selectedExercise);
            }
          }}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="checkmark"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">Okay</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Optimized Modal */}
      {openModal && currentOpenedModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onRequestClose={() => setOpenModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-11/12 max-w-md bg-white rounded-2xl shadow-xl">
              {/* Modal Header */}
              <View className="items-center p-6 border-b border-gray-100">
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-3">
                  <Ionicons
                    name={currentOpenedModal.icon as any}
                    size={24}
                    color="#3b82f6"
                  />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-2">
                  {currentOpenedModal.name}
                </Text>
                <Text className="text-sm text-gray-600 text-center leading-5">
                  {getExerciseDescription(currentOpenedModal.name)}
                </Text>
              </View>

              {/* Modal Content */}
              <View className="p-6">
                {/* Exercise Details */}
                <View className="mb-6">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Intensity Levels
                  </Text>
                  <View className="space-y-2">
                    {intensityLevels.map((level) => (
                      <View key={level.level} className="flex-row items-center">
                        <View
                          className="w-1.5 h-1.5 rounded-full mr-3"
                          style={{ backgroundColor: level.color }}
                        />
                        <Text className="text-xs text-gray-600">
                          {level.level}:{" "}
                          {level.level === "Low"
                            ? "Light effort, comfortable pace"
                            : level.level === "Moderate"
                            ? "Steady effort, moderate pace"
                            : level.level === "High"
                            ? "Vigorous effort, challenging pace"
                            : "Maximum effort, high intensity"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Calories Display */}
                <View className="items-center mb-6">
                  <Text className="text-4xl font-bold text-gray-800">
                    {calculateCalories(
                      exercises.find((e) => e.id === currentOpenedModal.id)
                        ?.calories || 0,
                      selectedIntensity,
                      selectedDuration
                    )}
                  </Text>
                  <Text className="text-gray-500 text-lg">kcal</Text>
                </View>

                {/* Smooth Pickers Side by Side */}
                <View className="flex-row mb-3">
                  {renderSmoothIntensityPicker()}
                  {renderSmoothDurationPicker()}
                </View>
              </View>

              {/* Modal Footer */}
              <View className="flex-row p-6 border-t border-gray-100 gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
                  onPress={() => setOpenModal(false)}
                >
                  <Text className="text-gray-700 font-semibold text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-green-500 py-4 rounded-xl items-center"
                  onPress={updateExercise}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white font-semibold text-lg">
                      Save
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ExerciseLogScreen;
