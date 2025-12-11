import MedicalHeader from "@/components/headers/MedicalHeader";
import {
    FREQUENCY_OPTIONS,
    MEDICINE_TYPES,
    TIME_OPTIONS,
} from "@/constants/data";
import { useCreateMedication } from "@/hooks/useMedications";
import {
    CreateMedicationRequest,
    FrequencyType,
    MedicationType,
} from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Form type
interface MedicationFormData {
  name: string;
  dosage: string;
  type: MedicationType | "";
  frequency: FrequencyType | "";
  selectedTimes: string[];
  notes?: string;
  startDate: string;
  endDate?: string;
}

// Helper functions
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const getTodayString = (): string => new Date().toISOString().split("T")[0];

const AddMedicineScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [medicineData, setMedicineData] = useState<MedicationFormData>({
    name: "",
    dosage: "",
    type: "",
    frequency: "",
    selectedTimes: [],
    notes: "",
    startDate: getTodayString(),
    endDate: "",
  });

  const createMedicationMutation = useCreateMedication();

  // Derived values
  const selectedMedicineType = useMemo(
    () => MEDICINE_TYPES.find((type: any) => type.id === medicineData.type),
    [medicineData.type]
  );
  const selectedFrequency = useMemo(
    () =>
      FREQUENCY_OPTIONS.find((freq: any) => freq.id === medicineData.frequency),
    [medicineData.frequency]
  );
  const getProgressWidth = useCallback(
    () => `${(currentStep / 5) * 100}%`,
    [currentStep]
  );

  // Validation
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          medicineData.name.trim() !== "" && medicineData.dosage.trim() !== ""
        );
      case 2:
        return medicineData.type !== "";
      case 3:
        return medicineData.frequency !== "";
      case 4:
        return medicineData.selectedTimes.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, medicineData]);

  // Event handlers
  const handleNext = useCallback(() => {
    if (currentStep < 6 && isStepValid) setCurrentStep((prev) => prev + 1);
  }, [currentStep, isStepValid]);
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  }, [currentStep]);
  const handleInputChange = useCallback(
    (field: keyof MedicationFormData, value: string) => {
      setMedicineData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );
  const handleTypeSelect = useCallback((type: MedicationType) => {
    setMedicineData((prev) => ({ ...prev, type }));
  }, []);
  const handleFrequencySelect = useCallback((frequency: FrequencyType) => {
    setMedicineData((prev) => ({
      ...prev,
      frequency,
      selectedTimes: [],
    }));
  }, []);
  const handleTimeSelect = useCallback((time: string) => {
    setMedicineData((prev) => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(time)
        ? prev.selectedTimes.filter((t) => t !== time)
        : [...prev.selectedTimes, time],
    }));
  }, []);

  // Create medication request object
  const createMedicationRequest = useCallback((): CreateMedicationRequest => {
    return {
      name: medicineData.name,
      dosage: medicineData.dosage,
      type: medicineData.type as MedicationType,
      frequency: medicineData.frequency as FrequencyType,
      startDate: medicineData.startDate,
      endDate: medicineData.endDate,
      scheduleTimes: medicineData.selectedTimes,
      notes: medicineData.notes || undefined,
    };
  }, [medicineData]);

  // Handle medication creation
  const handleCreateMedication = useCallback(async () => {
    try {
      const medicationData = createMedicationRequest();
      await createMedicationMutation.mutateAsync(medicationData);

      Alert.alert(
        "Success!",
        "Your medication has been created successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/(root)/(med-tabs)/tracker" as any);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create medication. Please try again.", [
        { text: "OK" },
      ]);
      console.error("Failed to create medication:", error);
    }
  }, [createMedicationRequest, createMedicationMutation]);

  // Step components
  const renderStep1 = () => (
    <View className="flex-1 px-5">
      {/* Header */}
      <View className="items-center mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-1">
          Medicine Details
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          Enter your medicine information
        </Text>
      </View>

      {/* Medicine Name */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2 text-base">
          Medicine Name *
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-3 text-gray-800 text-base border border-gray-200"
          placeholder="e.g., Lisinopril, Aspirin"
          value={medicineData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      {/* Dosage */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2 text-base">
          Dosage *
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-3 text-gray-800 text-base border border-gray-200"
          placeholder="e.g., 10mg, 5ml, 1 tablet"
          value={medicineData.dosage}
          onChangeText={(text) => handleInputChange("dosage", text)}
          returnKeyType="next"
        />
      </View>

      {/* Notes */}
      <View className="mb-5">
        <Text className="text-gray-700 font-semibold mb-2 text-base">
          Notes (Optional)
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-3 text-gray-800 text-base border border-gray-200"
          placeholder="e.g., Take with food, Special instructions..."
          value={medicineData.notes}
          onChangeText={(text) => handleInputChange("notes", text)}
          returnKeyType="done"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Warning Message */}
      {(!medicineData.name.trim() || !medicineData.dosage.trim()) && (
        <View className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <Text className="text-amber-700 text-xs">
            Please fill in all required fields to continue
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Medicine Type
        </Text>
        <Text className="text-gray-600 text-center">
          Select the form of your medicine
        </Text>
      </View>
      <FlatList
        key={"flatlist-2"}
        data={MEDICINE_TYPES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: type }) => {
          const isSelected = medicineData.type === type.id;
          return (
            <TouchableOpacity
              onPress={() => handleTypeSelect(type.id)}
              activeOpacity={0.8}
              className={`w-[48%] rounded-3xl p-5 items-center mb-4 border-2 ${isSelected
                  ? "bg-teal-50 border-teal-400"
                  : "bg-white border-gray-200"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.1 : 0.05,
                shadowRadius: 8,
                elevation: isSelected ? 4 : 2,
              }}
            >
              <View
                className={`w-16 h-16 rounded-2xl items-center justify-center mb-4 ${isSelected ? "bg-teal-500" : type.iconBg
                  }`}
              >
                <Text className="text-3xl">{type.icon}</Text>
              </View>
              <Text
                className={`text-lg font-semibold ${isSelected ? "text-teal-700" : "text-gray-800"
                  }`}
              >
                {type.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Frequency</Text>
        <Text className="text-gray-600 text-center">
          How often do you take this medicine?
        </Text>
      </View>

      <FlatList
        key={"flatlist-1"}
        data={FREQUENCY_OPTIONS}
        numColumns={1}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: option }) => {
          const isSelected = medicineData.frequency === option.id;
          return (
            <TouchableOpacity
              onPress={() => handleFrequencySelect(option.id)}
              activeOpacity={0.8}
              className={`rounded-2xl p-4 border-2 ${isSelected
                  ? "bg-teal-50 border-teal-400"
                  : "bg-white border-gray-200"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text
                    className={`text-lg font-semibold ${isSelected ? "text-teal-700" : "text-gray-800"
                      }`}
                  >
                    {option.title}
                  </Text>
                  <Text className="text-gray-600 mt-1">{option.subtitle}</Text>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 bg-teal-500 rounded-full items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderStep4 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Select Times
        </Text>
        <Text className="text-gray-600 text-center">
          When do you take this medicine?
        </Text>
        {selectedFrequency?.recommendedTimes &&
          selectedFrequency?.recommendedTimes > 0 && (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
              <Text className="text-blue-700 text-sm text-center">
                💡 Recommended: Select {selectedFrequency.recommendedTimes} time
                {selectedFrequency.recommendedTimes > 1 ? "s" : ""}
              </Text>
            </View>
          )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(TIME_OPTIONS).map(([label, value]) => {
            const selected = medicineData.selectedTimes.includes(
              value as string
            );
            return (
              <TouchableOpacity
                key={label}
                onPress={() => handleTimeSelect(value as string)}
                activeOpacity={0.8}
                className={`flex-row items-center justify-center mb-3 rounded-full px-4 py-3 w-[32%] border-2 ${selected
                    ? "bg-teal-500 border-teal-500"
                    : "bg-white border-gray-200"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: selected ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: selected ? 3 : 1,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={selected ? "white" : "#6B7280"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  className={`font-medium text-xs ${selected ? "text-white" : "text-gray-700"
                    }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const renderStep5 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Schedule Duration
        </Text>
        <Text className="text-gray-600 text-center">
          Set when to start and optionally when to end this medication
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Start Date Section */}
        <View className="mb-8">
          <Text className="text-gray-700 font-semibold mb-4 text-lg">
            Start Date *
          </Text>

          {/* Current Start Date Display */}
          <View className="bg-white rounded-2xl border border-gray-200 mb-4">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              onPress={() => {
                // You would implement a date picker here
                // For React Native, you might use @react-native-datepicker/datepicker
                console.log("Open start date picker");
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-teal-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="calendar-outline" size={24} color="#059669" />
                </View>
                <View>
                  <Text className="text-gray-800 font-semibold text-base">
                    {formatDateForDisplay(medicineData.startDate) ||
                      "Select start date"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {medicineData.startDate === getTodayString()
                      ? "Today"
                      : "Custom date"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Quick Start Date Options */}
          <Text className="text-gray-600 text-sm mb-3">Quick options:</Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity
              onPress={() => handleInputChange("startDate", getTodayString())}
              className={`mr-3 mb-3 px-4 py-2 rounded-full border-2 ${medicineData.startDate === getTodayString()
                  ? "bg-teal-50 border-teal-400"
                  : "bg-white border-gray-200"
                }`}
            >
              <Text
                className={`text-sm ${medicineData.startDate === getTodayString()
                    ? "text-teal-700 font-semibold"
                    : "text-gray-700"
                  }`}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                handleInputChange(
                  "startDate",
                  tomorrow.toISOString().split("T")[0]
                );
              }}
              className={`mr-3 mb-3 px-4 py-2 rounded-full border-2 ${medicineData.startDate ===
                  new Date(Date.now() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                  ? "bg-teal-50 border-teal-400"
                  : "bg-white border-gray-200"
                }`}
            >
              <Text
                className={`text-sm ${medicineData.startDate ===
                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                    ? "text-teal-700 font-semibold"
                    : "text-gray-700"
                  }`}
              >
                Tomorrow
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* End Date Section */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-4 text-lg">
            End Date (Optional)
          </Text>

          <Text className="text-gray-600 text-sm mb-4">
            Leave empty for ongoing medication or set an end date for temporary
            treatments
          </Text>

          {/* Current End Date Display */}
          <View className="bg-white rounded-2xl border border-gray-200 mb-4">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              onPress={() => {
                // You would implement a date picker here
                console.log("Open end date picker");
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text className="text-gray-800 font-semibold text-base">
                    {medicineData.endDate
                      ? formatDateForDisplay(medicineData.endDate)
                      : "No end date (ongoing)"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {medicineData.endDate
                      ? "Custom end date"
                      : "Continuous medication"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Quick End Date Options */}
          {medicineData.startDate && (
            <>
              <Text className="text-gray-600 text-sm mb-3">
                Common durations:
              </Text>
              <View className="flex-row flex-wrap">
                {[
                  { label: "1 Week", days: 7 },
                  { label: "2 Weeks", days: 14 },
                  { label: "1 Month", days: 30 },
                  { label: "3 Months", days: 90 },
                ].map((option) => {
                  const endDate = new Date(medicineData.startDate);
                  endDate.setDate(endDate.getDate() + option.days);
                  const endDateString = endDate.toISOString().split("T")[0];

                  return (
                    <TouchableOpacity
                      key={option.label}
                      onPress={() =>
                        handleInputChange("endDate", endDateString)
                      }
                      className={`mr-3 mb-3 px-4 py-2 rounded-full border-2 ${medicineData.endDate === endDateString
                          ? "bg-blue-50 border-blue-400"
                          : "bg-white border-gray-200"
                        }`}
                    >
                      <Text
                        className={`text-sm ${medicineData.endDate === endDateString
                            ? "text-blue-700 font-semibold"
                            : "text-gray-700"
                          }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  onPress={() => handleInputChange("endDate", "")}
                  className={`mr-3 mb-3 px-4 py-2 rounded-full border-2 ${!medicineData.endDate
                      ? "bg-gray-100 border-gray-400"
                      : "bg-white border-gray-200"
                    }`}
                >
                  <Text
                    className={`text-sm ${!medicineData.endDate
                        ? "text-gray-700 font-semibold"
                        : "text-gray-700"
                      }`}
                  >
                    No end date
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Duration Summary */}
        {medicineData.startDate && (
          <View className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-4 border border-teal-200">
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={20} color="#059669" />
              <Text className="text-teal-800 font-semibold ml-2">
                Duration Summary
              </Text>
            </View>
            <Text className="text-teal-700 text-sm">
              {medicineData.endDate ? (
                <>
                  Treatment from{" "}
                  <Text className="font-semibold">
                    {formatDateForDisplay(medicineData.startDate)}
                  </Text>{" "}
                  to{" "}
                  <Text className="font-semibold">
                    {formatDateForDisplay(medicineData.endDate)}
                  </Text>
                  {(() => {
                    const start = new Date(medicineData.startDate);
                    const end = new Date(medicineData.endDate);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <Text className="text-teal-600">
                        {"\n"}({diffDays} day{diffDays !== 1 ? "s" : ""} total)
                      </Text>
                    );
                  })()}
                </>
              ) : (
                <>
                  Ongoing treatment starting{" "}
                  <Text className="font-semibold">
                    {formatDateForDisplay(medicineData.startDate)}
                  </Text>
                  <Text className="text-teal-600">{"\n"}(No end date set)</Text>
                </>
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderStep6 = () => (
    <ScrollView>
      <View className="flex-1 px-6 mt-10 justify-center">
        {/* Success Animation */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-teal-500 rounded-full items-center justify-center mb-6 shadow-lg">
            <Ionicons name="checkmark" size={36} color="white" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Perfect! 🎉
          </Text>
          <Text className="text-gray-600 text-center px-4">
            Your medicine has been configured successfully
          </Text>
        </View>

        {/* Comprehensive Medicine Card */}
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          {/* Header */}
          <View className="flex-row items-start mb-2">
            <View className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl items-center justify-center mr-4 shadow-sm">
              <Text className="text-md">
                {selectedMedicineType?.icon || "💊"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900 mb-1">
                {medicineData.name}
              </Text>
              <Text className="text-gray-600 text-xs ">
                {medicineData.dosage} •{" "}
                {selectedMedicineType?.title || "Medicine"}
              </Text>
            </View>
            <View className="bg-teal-50 px-3 py-1 rounded-full border border-teal-600 ">
              <Text className="text-teal-600  text-xs">Active</Text>
            </View>
          </View>

          {/* Frequency Info */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-2">
            <View className="flex-row items-center mb-2">
              <Ionicons name="refresh-outline" size={20} color="#059669" />
              <Text className="text-gray-800 font-semibold ml-2">
                Frequency
              </Text>
            </View>
            <Text className="text-gray-700 text-xs ml-7">
              {selectedFrequency?.title || medicineData.frequency} -{" "}
              {selectedFrequency?.subtitle}
            </Text>
          </View>

          {/* Timing Schedule */}
          {medicineData.selectedTimes.length > 0 && (
            <View className="mb-2">
              <View className="flex-row items-center mb-3 ">
                <Ionicons name="time-outline" size={20} color="#059669" />
                <Text className="text-gray-800 font-semibold ml-2">
                  Schedule
                </Text>
              </View>
              <View className="flex-row flex-wrap  ml-7">
                {medicineData.selectedTimes.map((time, index) => (
                  <View
                    key={index}
                    className="bg-teal-100 px-3 py-1 border border-teal-700 rounded-xl mr-2 mb-2"
                  >
                    <Text className="text-teal-700  text-xs">{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Stats */}
          <View className="flex-row justify-between bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl px-4 py-2 ">
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-teal-600">
                {medicineData.selectedTimes.length || "0"}
              </Text>
              <Text className="text-gray-600 text-xs">Times/Day</Text>
            </View>
            <View className="w-px bg-gray-300 mx-4" />
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-blue-600">0</Text>
              <Text className="text-gray-600 text-xs">Missed</Text>
            </View>
            <View className="w-px bg-gray-300 mx-4" />
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-green-600">100%</Text>
              <Text className="text-gray-600 text-xs">Adherence</Text>
            </View>
          </View>
        </View>

        {/* Next Steps Info */}
        <View className="bg-blue-50 border border-blue-200 rounded-2xl mb-1 p-4 mt-6">
          <Text className="text-blue-800 font-semibold mb-2">What's Next?</Text>
          <Text className="text-blue-700 text-sm leading-5">
            • Notifications will remind you at scheduled times{"\n"}• Track your
            progress on the dashboard{"\n"}• Mark doses as taken or missed
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView className="flex-1 px-2 py-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Medical Header */}
      <MedicalHeader />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 mb-4">
        <TouchableOpacity
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          onPress={handlePrevious}
          disabled={currentStep === 1}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentStep === 1 ? "#9ca3af" : "#4ade80"}
          />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xl font-bold text-gray-900">Add Medicine</Text>
          <Text className="text-gray-600">Step {currentStep} of 6</Text>
        </View>

        <View className="w-10" />
      </View>

      {/* Progress Bar */}
      <View className="mx-4 mb-4">
        <View className="h-2 bg-gray-200 rounded-full">
          <View
            className="h-2 bg-green-500 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() } as ViewStyle}
          />
        </View>
      </View>

      {/* Content */}
      {renderCurrentStep()}

      {/* Navigation Buttons */}
      <View className="px-6 pb-6">
        {currentStep < 6 ? (
          <View className="flex-row space-x-4">
            {currentStep > 1 && (
              <TouchableOpacity
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 items-center"
                onPress={handlePrevious}
              >
                <View className="flex-row items-center">
                  <Ionicons name="chevron-back" size={20} color="#6B7280" />
                  <Text className="text-gray-600 font-semibold ml-1">
                    Previous
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`rounded-2xl py-4 items-center ${currentStep === 1 ? "flex-1" : "flex-1"
                } ${isStepValid ? "bg-teal-500" : "bg-gray-300"}`}
              onPress={handleNext}
              disabled={!isStepValid}
            >
              <View className="flex-row items-center">
                <Text
                  className={`font-semibold mr-1 ${isStepValid ? "text-white" : "text-gray-500"
                    }`}
                >
                  {currentStep === 5 ? "Create Medicine" : "Next"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isStepValid ? "white" : "#6B7280"}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className={`bg-teal-500 rounded-2xl py-4 items-center shadow-lg ${createMedicationMutation.isPending ? "opacity-70" : ""
              }`}
            onPress={handleCreateMedication}
            disabled={createMedicationMutation.isPending}
          >
            <View className="flex-row items-center">
              {createMedicationMutation.isPending ? (
                <>
                  <View className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-bold text-lg">
                    Creating...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Start Tracking
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddMedicineScreen;
