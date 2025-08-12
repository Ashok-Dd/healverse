import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MedicineData {
    name: string;
    dosage: string;
    type: string;
    frequency: string;
    selectedTimes: string[];
}

interface MedicineType {
    id: string;
    title: string;
    icon: string;
    bgColor: string;
    iconBg: string;
}

interface FrequencyOption {
    id: string;
    title: string;
    subtitle: string;
    recommendedTimes: number;
}

const AddMedicineScreen: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [medicineData, setMedicineData] = useState<MedicineData>({
        name: '',
        dosage: '',
        type: '',
        frequency: '',
        selectedTimes: [],
    });

    // Static data with better typing
    const medicineTypes: MedicineType[] = useMemo(() => [
        { id: 'tablet', title: 'Tablet', icon: '💊', bgColor: 'bg-blue-100', iconBg: 'bg-blue-500' },
        { id: 'capsule', title: 'Capsule', icon: '💊', bgColor: 'bg-gray-100', iconBg: 'bg-teal-500' },
        { id: 'liquid', title: 'Liquid', icon: '🧪', bgColor: 'bg-gray-100', iconBg: 'bg-purple-500' },
        { id: 'injection', title: 'Injection', icon: '💉', bgColor: 'bg-gray-100', iconBg: 'bg-pink-500' },
        { id: 'inhaler', title: 'Inhaler', icon: '🫁', bgColor: 'bg-gray-100', iconBg: 'bg-orange-500' },
        { id: 'drops', title: 'Drops', icon: '💧', bgColor: 'bg-gray-100', iconBg: 'bg-blue-400' },
    ], []);

    const frequencyOptions: FrequencyOption[] = useMemo(() => [
        { id: 'once', title: 'Once Daily', subtitle: 'Take once per day', recommendedTimes: 1 },
        { id: 'twice', title: 'Twice Daily', subtitle: 'Morning & Evening', recommendedTimes: 2 },
        { id: 'three', title: 'Three Times', subtitle: 'Morning, Afternoon & Night', recommendedTimes: 3 },
        { id: 'four', title: 'Four Times', subtitle: 'Every 6 hours', recommendedTimes: 4 },
        { id: 'weekly', title: 'Weekly', subtitle: 'Once a week', recommendedTimes: 1 },
        { id: 'asneeded', title: 'As Needed', subtitle: 'When required', recommendedTimes: 0 },
    ], []);

    const timeOptions: string[] = useMemo(() => [
        '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
    ], []);

    // Computed values
    const selectedMedicineType = useMemo(() =>
        medicineTypes.find(type => type.id === medicineData.type),
        [medicineData.type, medicineTypes]
    );

    const selectedFrequency = useMemo(() =>
        frequencyOptions.find(freq => freq.id === medicineData.frequency),
        [medicineData.frequency, frequencyOptions]
    );

    const getProgressWidth = useCallback(() => `${(currentStep / 5) * 100}%`, [currentStep]);

    const isStepValid = useMemo(() => {
        switch (currentStep) {
            case 1: return medicineData.name.trim() !== '' && medicineData.dosage.trim() !== '';
            case 2: return medicineData.type !== '';
            case 3: return medicineData.frequency !== '';
            case 4: return medicineData.selectedTimes.length > 0 || medicineData.frequency === 'asneeded';
            case 5: return true;
            default: return false;
        }
    }, [currentStep, medicineData]);

    // Event handlers
    const handleNext = useCallback(() => {
        if (currentStep < 5 && isStepValid) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, isStepValid]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleInputChange = useCallback((field: keyof MedicineData, value: string) => {
        setMedicineData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleTypeSelect = useCallback((type: string) => {
        setMedicineData(prev => ({ ...prev, type }));
    }, []);

    const handleFrequencySelect = useCallback((frequency: string) => {
        setMedicineData(prev => ({
            ...prev,
            frequency,
            selectedTimes: [] // Reset selected times when frequency changes
        }));
    }, []);

    const handleTimeSelect = useCallback((time: string) => {
        setMedicineData(prev => ({
            ...prev,
            selectedTimes: prev.selectedTimes.includes(time)
                ? prev.selectedTimes.filter(t => t !== time)
                : [...prev.selectedTimes, time]
        }));
    }, []);

    // Step components
    const renderStep1 = () => (
        <View className="flex-1 px-6">
            <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-gray-800 mb-2">Medicine Details</Text>
                <Text className="text-gray-600 text-center">Enter your medicine information</Text>
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3 text-lg">Medicine Name *</Text>
                <TextInput
                    className="bg-white rounded-2xl px-5 py-4 text-gray-800 text-lg border border-gray-200"
                    placeholder="e.g., Lisinopril, Aspirin"
                    value={medicineData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    autoCapitalize="words"
                    returnKeyType="next"
                />
            </View>

            <View className="mb-8">
                <Text className="text-gray-700 font-semibold mb-3 text-lg">Dosage *</Text>
                <TextInput
                    className="bg-white rounded-2xl px-5 py-4 text-gray-800 text-lg border border-gray-200"
                    placeholder="e.g., 10mg, 5ml, 1 tablet"
                    value={medicineData.dosage}
                    onChangeText={(text) => handleInputChange('dosage', text)}
                    returnKeyType="next"
                />
            </View>

            {(!medicineData.name.trim() || !medicineData.dosage.trim()) && (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <Text className="text-amber-700 text-sm">
                        Please fill in all required fields to continue
                    </Text>
                </View>
            )}
        </View>
    );

    const renderStep2 = () => (
        <View className="flex-1 px-6">
            <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-gray-800 mb-2">Medicine Type</Text>
                <Text className="text-gray-600 text-center">Select the form of your medicine</Text>
            </View>
            <FlatList
                data={medicineTypes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: type }) => {
                    const isSelected = medicineData.type === type.id;
                    return (
                        <TouchableOpacity
                            onPress={() => handleTypeSelect(type.id)}
                            activeOpacity={0.8}
                            className={`w-[48%] rounded-3xl p-5 items-center mb-4 border-2 ${isSelected
                                    ? 'bg-teal-50 border-teal-400'
                                    : 'bg-white border-gray-200'
                                }`}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isSelected ? 0.1 : 0.05,
                                shadowRadius: 8,
                                elevation: isSelected ? 4 : 2,
                            }}
                        >
                            <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-4 ${isSelected ? 'bg-teal-500' : type.iconBg
                                }`}>
                                <Text className="text-3xl">{type.icon}</Text>
                            </View>
                            <Text className={`text-lg font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-800'
                                }`}>
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
                <Text className="text-gray-600 text-center">How often do you take this medicine?</Text>
            </View>

            <FlatList
                data={frequencyOptions}
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
                                    ? 'bg-teal-50 border-teal-400'
                                    : 'bg-white border-gray-200'
                                }`}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className={`text-lg font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-800'
                                        }`}>
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
                <Text className="text-3xl font-bold text-gray-800 mb-2">Select Times</Text>
                <Text className="text-gray-600 text-center">When do you take this medicine?</Text>
                {selectedFrequency?.recommendedTimes && selectedFrequency?.recommendedTimes > 0 && (
                    <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
                        <Text className="text-blue-700 text-sm text-center">
                            💡 Recommended: Select {selectedFrequency.recommendedTimes} time{selectedFrequency.recommendedTimes > 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {medicineData.frequency === 'asneeded' ? (
                <View className="flex-1 justify-center items-center">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="time-outline" size={40} color="#6B7280" />
                    </View>
                    <Text className="text-xl font-semibold text-gray-800 mb-2">Take as needed</Text>
                    <Text className="text-gray-600 text-center">
                        No specific times required for this frequency
                    </Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-row flex-wrap justify-between">
                        {timeOptions.map((time) => {
                            const selected = medicineData.selectedTimes.includes(time);
                            return (
                                <TouchableOpacity
                                    key={time}
                                    onPress={() => handleTimeSelect(time)}
                                    activeOpacity={0.8}
                                    className={`flex-row items-center justify-center mb-3 rounded-full px-4 py-3 w-[32%] border-2 ${selected
                                            ? 'bg-teal-500 border-teal-500'
                                            : 'bg-white border-gray-200'
                                        }`}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: selected ? 0.2 : 0.05,
                                        shadowRadius: 4,
                                        elevation: selected ? 3 : 1,
                                    }}
                                >
                                    <Ionicons
                                        name="time-outline"
                                        size={16}
                                        color={selected ? 'white' : '#6B7280'}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text className={`font-medium text-xs ${selected ? 'text-white' : 'text-gray-700'
                                        }`}>
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            )}
        </View>
    );

    const renderStep5 = () => (
        <View className="flex-1 px-6 justify-center">
            {/* Success Animation */}
            <View className="items-center mb-8">
                <View className="w-24 h-24 bg-teal-500 rounded-full items-center justify-center mb-6 shadow-lg">
                    <Ionicons name="checkmark" size={48} color="white" />
                </View>
                <Text className="text-3xl font-bold text-gray-800 mb-2">Perfect! 🎉</Text>
                <Text className="text-gray-600 text-center px-4">
                    Your medicine has been configured successfully
                </Text>
            </View>

            {/* Comprehensive Medicine Card */}
            <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                {/* Header */}
                <View className="flex-row items-start mb-5">
                    <View className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl items-center justify-center mr-4 shadow-sm">
                        <Text className="text-3xl">{selectedMedicineType?.icon || '💊'}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-900 mb-1">
                            {medicineData.name}
                        </Text>
                        <Text className="text-gray-600">
                            {medicineData.dosage} • {selectedMedicineType?.title || 'Medicine'}
                        </Text>
                    </View>
                    <View className="bg-teal-50 px-3 py-1 rounded-full">
                        <Text className="text-teal-600 font-semibold text-sm">Active</Text>
                    </View>
                </View>

                {/* Frequency Info */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-5">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="refresh-outline" size={20} color="#059669" />
                        <Text className="text-gray-800 font-semibold ml-2">Frequency</Text>
                    </View>
                    <Text className="text-gray-700 ml-7">
                        {selectedFrequency?.title || medicineData.frequency}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-7">
                        {selectedFrequency?.subtitle}
                    </Text>
                </View>

                {/* Timing Schedule */}
                {medicineData.selectedTimes.length > 0 && (
                    <View className="mb-5">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="time-outline" size={20} color="#059669" />
                            <Text className="text-gray-800 font-semibold ml-2">Schedule</Text>
                        </View>
                        <View className="flex-row flex-wrap ml-7">
                            {medicineData.selectedTimes.map((time, index) => (
                                <View
                                    key={index}
                                    className="bg-teal-100 px-3 py-2 rounded-xl mr-2 mb-2"
                                >
                                    <Text className="text-teal-700 font-medium text-sm">{time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Quick Stats */}
                <View className="flex-row justify-between bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-4">
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-teal-600">
                            {medicineData.selectedTimes.length || (medicineData.frequency === 'asneeded' ? '∞' : '0')}
                        </Text>
                        <Text className="text-gray-600 text-xs">Times/Day</Text>
                    </View>
                    <View className="w-px bg-gray-300 mx-4" />
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-blue-600">0</Text>
                        <Text className="text-gray-600 text-xs">Missed</Text>
                    </View>
                    <View className="w-px bg-gray-300 mx-4" />
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-green-600">100%</Text>
                        <Text className="text-gray-600 text-xs">Adherence</Text>
                    </View>
                </View>
            </View>

            {/* Next Steps Info */}
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6">
                <Text className="text-blue-800 font-semibold mb-2">What's Next?</Text>
                <Text className="text-blue-700 text-sm leading-5">
                    • Notifications will remind you at scheduled times{'\n'}
                    • Track your progress on the dashboard{'\n'}
                    • Mark doses as taken or missed
                </Text>
            </View>
        </View>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            default: return renderStep1();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                    onPress={handlePrevious}
                    disabled={currentStep === 1}
                >
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={currentStep === 1 ? "#D1D5DB" : "#374151"}
                    />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-xl font-bold text-gray-800">Add Medicine</Text>
                    <Text className="text-gray-500">Step {currentStep} of 5</Text>
                </View>

                <View className="w-10" />
            </View>

            {/* Progress Bar */}
            <View className="mx-6 mb-6">
                <View className="h-2 bg-gray-200 rounded-full">
                    <View
                        className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: getProgressWidth() } as ViewStyle}
                    />
                </View>
            </View>

            {/* Content */}
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <View className="px-6 pb-6">
                {currentStep < 5 ? (
                    <View className="flex-row space-x-4">
                        {currentStep > 1 && (
                            <TouchableOpacity
                                className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 items-center"
                                onPress={handlePrevious}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="chevron-back" size={20} color="#6B7280" />
                                    <Text className="text-gray-600 font-semibold ml-1">Previous</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className={`rounded-2xl py-4 items-center ${currentStep === 1 ? 'flex-1' : 'flex-1'
                                } ${isStepValid ? 'bg-teal-500' : 'bg-gray-300'}`}
                            onPress={handleNext}
                            disabled={!isStepValid}
                        >
                            <View className="flex-row items-center">
                                <Text className={`font-semibold mr-1 ${isStepValid ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {currentStep === 4 ? 'Create Medicine' : 'Next'}
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
                        className="bg-teal-500 rounded-2xl py-4 items-center shadow-lg"
                        onPress={() => {
                            console.log('Medicine created:', medicineData);
                            // Handle navigation or save medicine
                        }}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="add-circle-outline" size={24} color="white" />
                            <Text className="text-white font-bold text-lg ml-2">Start Tracking</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AddMedicineScreen;