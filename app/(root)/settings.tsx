import { useAuthStore } from "@/store/authStore"; // Adjust path as needed
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    ListRenderItem,
    Modal,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {UserProfile , User} from "@/types/type";

// Type Definitions
// type SettingItemType = "navigation" | "button" | "toggle" | "modal";

interface BaseSettingItem {
    id: string;
    icon:
        | React.ComponentProps<typeof Ionicons>["name"]
        | React.ComponentProps<typeof Feather>["name"]
        | React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    iconFamily: "ionicons" | "feather" | "material";
    title: string;
}

interface NavigationSettingItem extends BaseSettingItem {
    type: "navigation";
    value: string;
    action: () => void;
    warning?: boolean;
    warningText?: string;
    screenPath: string;
    fieldKey: string;
}

interface ModalSettingItem extends BaseSettingItem {
    type: "modal";
    value: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    fieldKey: string;
}

interface ButtonSettingItem extends BaseSettingItem {
    type: "button";
    action: () => void;
    buttonText: string;
    buttonIcon: React.ComponentProps<typeof Ionicons>["name"];
    screenPath?: string;
    category: string;
}

interface ToggleSettingItem extends BaseSettingItem {
    type: "toggle";
    toggleValue: boolean;
    onToggle: (value: boolean) => void;
}

type SettingItem =
    | NavigationSettingItem
    | ModalSettingItem
    | ButtonSettingItem
    | ToggleSettingItem;

interface SettingSection {
    id: string;
    title: string;
    items: SettingItem[];
}




// Navigation Helper Types
interface SettingNavigationParams {
    settingId: string;
    title: string;
    icon: string;
    iconFamily: string;
    currentValue?: string;
    fieldKey?: string;
    category: "account" | "diet";
    inputType?: "text" | "numeric" | "selection";
    validationRules?: {
        min?: number;
        max?: number;
        required?: boolean;
    };
}

// Navigation Functions
const navigateToSettingDetail = (params: SettingNavigationParams): void => {
    const queryParams = new URLSearchParams({
        settingId: params.settingId,
        title: params.title,
        icon: params.icon,
        iconFamily: params.iconFamily,
        category: params.category,
        ...(params.currentValue && { currentValue: params.currentValue }),
        ...(params.fieldKey && { fieldKey: params.fieldKey }),
        ...(params.inputType && { inputType: params.inputType }),
        ...(params.validationRules && {
            validationRules: JSON.stringify(params.validationRules),
        }),
    });

    //   router.push(`/settings/detail?${queryParams.toString()}`);
};

// Helper Functions
const formatDisplayValue = (
    key: string,
    value: any,
    profile?: UserProfile
): string => {
    if (!profile) return "Not set";

    switch (key) {
        case "gender":
            return value === "MALE"
                ? "Male"
                : value === "FEMALE"
                    ? "Female"
                    : "Other";
        case "age":
            return `${value} years`;
        case "heightCm":
            return `${value} cm`;
        case "currentWeightKg":
            return `${value} kg`;
        case "targetWeightKg":
            return `${value} kg`;
        case "activityLevel":
            return value
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/^\w/, (c: string) => c.toUpperCase());
        case "goal":
            return value
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/^\w/, (c: string) => c.toUpperCase());
        case "dietaryRestriction":
            return value === "NONE"
                ? "None"
                : value.charAt(0) + value.slice(1).toLowerCase();
        case "healthCondition":
            return value === "NONE"
                ? "None"
                : value.charAt(0) + value.slice(1).toLowerCase();
        default:
            return value?.toString() || "Not set";
    }
};

// Icon Renderer Component
const IconRenderer: React.FC<{
    name: string;
    family: "ionicons" | "feather" | "material";
    size?: number;
    color?: string;
}> = ({ name, family, size = 20, color = "#374151" }) => {
    switch (family) {
        case "ionicons":
            return <Ionicons name={name as any} size={size} color={color} />;
        case "feather":
            return <Feather name={name as any} size={size} color={color} />;
        case "material":
            return (
                <MaterialCommunityIcons name={name as any} size={size} color={color} />
            );
        default:
            return <Ionicons name="settings-outline" size={size} color={color} />;
    }
};

// Main Component
const SettingsScreen: React.FC = () => {
    const { user } = useAuthStore();
    const [exerciseCalories, setExerciseCalories] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalOptions, setModalOptions] = useState<
        { label: string; value: string }[]
    >([]);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalFieldKey, setModalFieldKey] = useState<string>("");

    const profile = user?.profile;

    // Navigation Functions
    const handleBack = useCallback((): void => {
        router.back();
    }, []);

    const handleSignIn = useCallback((): void => {
        if (user) {
            // User is already signed in, navigate to account details
            navigateToSettingDetail({
                settingId: "account-details",
                title: "Account Details",
                icon: "person-outline",
                iconFamily: "ionicons",
                category: "account",
                inputType: "text",
            });
        } else {
            // Navigate to sign in
            router.push("/(auth)/welcome");
        }
    }, [user]);

    // Modal Functions
    const openModal = useCallback(
        (
            title: string,
            options: { label: string; value: string }[],
            fieldKey: string
        ) => {
            setModalTitle(title);
            setModalOptions(options);
            setModalFieldKey(fieldKey);
            setModalVisible(true);
        },
        []
    );

    const handleModalSelect = useCallback(
        (value: string) => {
            console.log(`Updating ${modalFieldKey} to:`, value);
            setModalVisible(false);
        },
        [profile, modalFieldKey]
    );

    // Navigation Handlerss
    const handleEditName = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "name",
            title: "Name",
            icon: "person-outline",
            iconFamily: "ionicons",
            currentValue: user?.username,
            fieldKey: "username",
            category: "account",
            inputType: "text",
            validationRules: { required: true },
        });
    }, [user?.username]);

    const handleEditAge = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "age",
            title: "Age",
            icon: "calendar-outline",
            iconFamily: "ionicons",
            currentValue: profile?.age?.toString(),
            fieldKey: "age",
            category: "account",
            inputType: "numeric",
            validationRules: { min: 1, max: 149, required: true },
        });
    }, [profile?.age]);

    const handleEditHeight = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "height",
            title: "Height",
            icon: "resize-outline",
            iconFamily: "ionicons",
            currentValue: profile?.heightCm?.toString(),
            fieldKey: "heightCm",
            category: "account",
            inputType: "numeric",
            validationRules: { min: 1, max: 299, required: true },
        });
    }, [profile?.heightCm]);

    const handleEditWeight = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "weight",
            title: "Current Weight",
            icon: "fitness-outline",
            iconFamily: "ionicons",
            currentValue: profile?.currentWeightKg?.toString(),
            fieldKey: "currentWeightKg",
            category: "account",
            inputType: "numeric",
            validationRules: { min: 1, max: 999, required: true },
        });
    }, [profile?.currentWeightKg]);

    const handleEditGoal = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "goal",
            title: "Goal",
            icon: "target",
            iconFamily: "feather",
            currentValue: profile?.goal,
            fieldKey: "goal",
            category: "diet",
            inputType: "selection",
        });
    }, [profile?.goal]);

    const handleEditActivityLevel = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "activity-level",
            title: "Activity Level",
            icon: "run-outline",
            iconFamily: "ionicons",
            currentValue: profile?.activityLevel,
            fieldKey: "activityLevel",
            category: "diet",
            inputType: "selection",
        });
    }, [profile?.activityLevel]);

    const handleEditRestrictions = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "restrictions",
            title: "Dietary Restrictions",
            icon: "restaurant-outline",
            iconFamily: "ionicons",
            currentValue: profile?.dietaryRestriction,
            fieldKey: "dietaryRestriction",
            category: "diet",
            inputType: "selection",
        });
    }, [profile?.dietaryRestriction]);

    const handleEditHealthConditions = useCallback((): void => {
        navigateToSettingDetail({
            settingId: "health-conditions",
            title: "Health Conditions",
            icon: "medical-outline",
            iconFamily: "ionicons",
            currentValue: profile?.healthCondition,
            fieldKey: "healthCondition",
            category: "diet",
            inputType: "selection",
        });
    }, [profile?.healthCondition]);

    // Modal Handlers
    const handleGenderModal = useCallback((): void => {
        openModal(
            "Select Gender",
            [
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
            ],
            "gender"
        );
    }, [openModal]);

    const handleUnitModal = useCallback((): void => {
        openModal(
            "Select Unit System",
            [
                { label: "Metric (kg, cm)", value: "METRIC" },
                { label: "Imperial (lb, ft)", value: "IMPERIAL" },
            ],
            "unit"
        );
    }, [openModal]);

    // Settings Data Configuration
    const settingsData: SettingSection[] = [
        {
            id: "account",
            title: "Account",
            items: [
                {
                    id: "account-signin",
                    icon: "person-outline",
                    iconFamily: "ionicons",
                    title: user ? "Account Details" : "Account",
                    type: "button",
                    action: handleSignIn,
                    buttonText: user ? "View Details" : "Sign in",
                    buttonIcon: "arrow-forward-outline",
                    category: "account",
                },
                {
                    id: "name",
                    icon: "person-outline",
                    iconFamily: "ionicons",
                    title: "Name",
                    value: user?.username || "Not set",
                    type: "navigation",
                    action: handleEditName,
                    screenPath: "/settings/detail",
                    fieldKey: "username",
                },
                {
                    id: "age",
                    icon: "calendar-outline",
                    iconFamily: "ionicons",
                    title: "Age",
                    value: formatDisplayValue(
                        "age",
                        profile?.age,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditAge,
                    screenPath: "/settings/detail",
                    fieldKey: "age",
                },
                {
                    id: "gender",
                    icon: "people-outline",
                    iconFamily: "ionicons",
                    title: "Gender",
                    value: formatDisplayValue(
                        "gender",
                        profile?.gender,
                        profile as UserProfile
                    ),
                    type: "modal",
                    options: [
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                        { label: "Other", value: "OTHER" },
                    ],
                    onSelect: () => {},
                    fieldKey: "gender",
                },
                {
                    id: "height",
                    icon: "resize-outline",
                    iconFamily: "ionicons",
                    title: "Height",
                    value: formatDisplayValue(
                        "heightCm",
                        profile?.heightCm,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditHeight,
                    screenPath: "/settings/detail",
                    fieldKey: "heightCm",
                },
                {
                    id: "weight",
                    icon: "fitness-outline",
                    iconFamily: "ionicons",
                    title: "Current Weight",
                    value: formatDisplayValue(
                        "currentWeightKg",
                        profile?.currentWeightKg,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditWeight,
                    screenPath: "/settings/detail",
                    fieldKey: "currentWeightKg",
                },
                {
                    id: "unit",
                    icon: "resize-outline",
                    iconFamily: "ionicons",
                    title: "Unit System",
                    value: "Metric (kg, cm)", // This could be made dynamic
                    type: "modal",
                    options: [
                        { label: "Metric (kg, cm)", value: "METRIC" },
                        { label: "Imperial (lb, ft)", value: "IMPERIAL" },
                    ],
                    onSelect: () => {},
                    fieldKey: "unit",
                },
            ],
        },
        {
            id: "diet",
            title: "Diet & Health",
            items: [
                {
                    id: "goal",
                    icon: "target",
                    iconFamily: "feather",
                    title: "Goal",
                    value: formatDisplayValue(
                        "goal",
                        profile?.goal,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditGoal,
                    screenPath: "/settings/detail",
                    fieldKey: "goal",
                },
                {
                    id: "activity-level",
                    icon: "person-outline",
                    iconFamily: "ionicons",
                    title: "Activity Level",
                    value: formatDisplayValue(
                        "activityLevel",
                        profile?.activityLevel,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditActivityLevel,
                    screenPath: "/settings/detail",
                    fieldKey: "activityLevel",
                },
                {
                    id: "restrictions",
                    icon: "restaurant-outline",
                    iconFamily: "ionicons",
                    title: "Dietary Restrictions",
                    value: formatDisplayValue(
                        "dietaryRestriction",
                        profile?.dietaryRestriction,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditRestrictions,
                    screenPath: "/settings/detail",
                    fieldKey: "dietaryRestriction",
                },
                {
                    id: "health-conditions",
                    icon: "medical-outline",
                    iconFamily: "ionicons",
                    title: "Health Conditions",
                    value: formatDisplayValue(
                        "healthCondition",
                        profile?.healthCondition,
                        profile as UserProfile
                    ),
                    type: "navigation",
                    action: handleEditHealthConditions,
                    screenPath: "/settings/detail",
                    fieldKey: "healthCondition",
                },
                {
                    id: "exercise-calories",
                    icon: "flame-outline",
                    iconFamily: "ionicons",
                    title: "Add exercise calories to daily goal",
                    type: "toggle",
                    toggleValue: exerciseCalories,
                    onToggle: setExerciseCalories,
                },
            ],
        },
        {
            id: "application",
            title: "Application",
            items: [
                {
                    id: "try-fitai",
                    icon: "cube-outline",
                    iconFamily: "ionicons",
                    title: "Try FitAI for free! 80% discount for you!",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to FitAI offer");
                    },
                    screenPath: "/fitai-offer",
                    fieldKey: "fitai-offer",
                },
                {
                    id: "upgrade-pro",
                    icon: "star-outline",
                    iconFamily: "ionicons",
                    title: "Upgrade to PRO",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to upgrade PRO");
                    },
                    screenPath: "/upgrade-pro",
                    fieldKey: "upgrade-pro",
                },
                {
                    id: "lifetime-offer",
                    icon: "infinite-outline",
                    iconFamily: "ionicons",
                    title: "Lifetime Offer",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to lifetime offer");
                    },
                    screenPath: "/lifetime-offer",
                    fieldKey: "lifetime-offer",
                },
                {
                    id: "rate-us",
                    icon: "star-outline",
                    iconFamily: "ionicons",
                    title: "Rate Us",
                    type: "button",
                    action: () => {
                        console.log("Rate us action triggered");
                    },
                    buttonText: "Rate",
                    buttonIcon: "star-outline",
                    category: "application",
                },
                {
                    id: "contact-us",
                    icon: "mail-outline",
                    iconFamily: "ionicons",
                    title: "Contact Us",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to contact us");
                    },
                    screenPath: "/contact",
                    fieldKey: "contact-us",
                },
                {
                    id: "manage-subscriptions",
                    icon: "card-outline",
                    iconFamily: "ionicons",
                    title: "Manage Subscriptions",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to manage subscriptions");
                    },
                    screenPath: "/subscriptions",
                    fieldKey: "manage-subscriptions",
                },
                {
                    id: "terms-service",
                    icon: "document-text-outline",
                    iconFamily: "ionicons",
                    title: "Terms of Service",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to terms of service");
                    },
                    screenPath: "/terms",
                    fieldKey: "terms-service",
                },
                {
                    id: "privacy-policy",
                    icon: "shield-checkmark-outline",
                    iconFamily: "ionicons",
                    title: "Privacy Policy",
                    value: "",
                    type: "navigation",
                    action: () => {
                        console.log("Navigate to privacy policy");
                    },
                    screenPath: "/privacy",
                    fieldKey: "privacy-policy",
                },
                {
                    id: "language",
                    icon: "globe-outline",
                    iconFamily: "ionicons",
                    title: "Language",
                    value: "English",
                    type: "modal",
                    options: [
                        { label: "English", value: "en" },
                        { label: "Hindi", value: "hi" },
                        { label: "Spanish", value: "es" },
                        { label: "French", value: "fr" },
                    ],
                    onSelect: (value: string) => {
                        console.log("Language selected:", value);
                    },
                    fieldKey: "language",
                },
                {
                    id: "country",
                    icon: "flag-outline",
                    iconFamily: "ionicons",
                    title: "Country",
                    value: "भारत", // India in Hindi as shown in image
                    type: "modal",
                    options: [
                        { label: "भारत (India)", value: "IN" },
                        { label: "United States", value: "US" },
                        { label: "United Kingdom", value: "UK" },
                        { label: "Canada", value: "CA" },
                    ],
                    onSelect: (value: string) => {
                        console.log("Country selected:", value);
                    },
                    fieldKey: "country",
                },
            ],
        },
    ];

    // Render Functions
    const renderModalOption = useCallback(
        ({ item }: { item: { label: string; value: string } }) => (
            <TouchableOpacity
                onPress={() => handleModalSelect(item.value)}
                className="px-6 py-4 border-b border-gray-100"
            >
                <Text className="text-base text-gray-900">{item.label}</Text>
            </TouchableOpacity>
        ),
        [handleModalSelect]
    );

    const renderSettingItem: ListRenderItem<SettingItem> = useCallback(
        ({ item, index }) => {
            if (!settingsData) return null;
            const section = settingsData.find((section) =>
                section.items.some((sectionItem) => sectionItem.id === item.id)
            );

            const isLastItem = index === (section?.items.length ?? 0) - 1;

            const handlePress = () => {
                if (item.type === "modal" && "options" in item) {
                    openModal(item.title, item.options, item.fieldKey);
                } else if (item.type !== "toggle" && "action" in item) {
                    item.action();
                }
            };

            return (
                <View className={`${isLastItem ? "" : "mb-1"}`}>
                    <TouchableOpacity
                        onPress={handlePress}
                        className="flex-row items-center justify-between px-4 py-1 bg-gray-100 rounded-lg active:bg-gray-50"
                        disabled={item.type === "toggle"}
                    >
                        {/* Left Side - Icon and Title */}
                        <View className="flex-row items-center flex-1">
                            <IconRenderer
                                name={item.icon}
                                family={item.iconFamily}
                                size={20}
                                color="#374151"
                            />
                            <Text className="text-sm text-gray-900 font-medium ml-3">
                                {item.title}
                            </Text>
                        </View>

                        {/* Right Side - Actions/Values */}
                        <View className="flex-row items-center">
                            {item.type === "button" && (
                                <TouchableOpacity
                                    onPress={item.action}
                                    className="bg-blue-100 px-3 py-1.5 rounded-full active:bg-blue-200"
                                >
                                    <View className="flex-row items-center">
                                        <IconRenderer
                                            name={item.buttonIcon}
                                            family="ionicons"
                                            size={14}
                                            color="#2563eb"
                                        />
                                        <Text className="text-blue-600 text-xs  ml-1">
                                            {item.buttonText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {(item.type === "navigation" || item.type === "modal") && (
                                <>
                                    <Text className="text-gray-500 mr-2 text-xs">
                                        {"value" in item ? item.value : ""}
                                    </Text>
                                    <IconRenderer
                                        name="chevron-right"
                                        family="feather"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                </>
                            )}

                            {item.type === "toggle" && (
                                <Switch
                                    value={item.toggleValue}
                                    onValueChange={item.onToggle}
                                    trackColor={{
                                        false: "#e5e7eb",
                                        true: "#22c55e",
                                    }}
                                    thumbColor="#ffffff"
                                    ios_backgroundColor="#e5e7eb"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            );
        },
        [settingsData, openModal]
    );

    const renderSection: ListRenderItem<SettingSection> = useCallback(
        ({ item }) => (
            <View className="px-4 pb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                    {item.title}
                </Text>
                <View className="bg-gray-50 rounded-xl p-1">
                    <FlatList
                        data={item.items}
                        renderItem={renderSettingItem}
                        keyExtractor={(settingItem: SettingItem) => settingItem.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        ),
        [renderSettingItem]
    );

    const keyExtractor = useCallback((item: SettingSection) => item.id, []);

    return (
        <SafeAreaView className="flex-1  bg-white">
            {/* Header */}
            <View className="flex-row items-center  justify-center py-2  px-4 border-b border-gray-100 relative bg-white">
                <TouchableOpacity
                    onPress={handleBack}
                    className="absolute left-4 px-2 active:bg-gray-100 rounded-full"
                >
                    <IconRenderer name="arrow-left" family="feather" size={20} />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <IconRenderer name="settings-outline" family="ionicons" size={24} />
                    <Text className="text-xl font-bold text-gray-900 ml-2">Settings</Text>
                </View>
            </View>

            {/* Settings Sections */}
            <FlatList
                data={settingsData}
                renderItem={renderSection}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pt-6"
                className="flex-1"
            />

            {/* Modal for selections */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black bg-opacity-50">
                    <View className="bg-white rounded-t-3xl">
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <Text className="text-lg font-bold text-gray-900">
                                {modalTitle}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="p-2"
                            >
                                <IconRenderer name="x" family="feather" size={20} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={modalOptions}
                            renderItem={renderModalOption}
                            keyExtractor={(item) => item.value}
                            className="max-h-80"
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default SettingsScreen;
