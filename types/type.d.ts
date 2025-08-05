import React from "react";

// Enums

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type ActivityLevel =
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'EXTREMELY_ACTIVE';

export type DietaryRestriction =
    | "NON_VEGETARIAN"
    | "VEGETARIAN"
    | "VEGAN"
    | "PESCATARIAN"
    | "KETO"
    | "PALEO"
    | "MEDITERRANEAN"
    | "GLUTEN_FREE"
    | "DAIRY_FREE"
    | "LOW_CARB"
    | "LOW_FAT";


export type Goal =
    | "LOSE_WEIGHT"
    | "MAINTAIN_WEIGHT"
    | "GAIN_WEIGHT"
    | "BUILD_MUSCLE"
    | "IMPROVE_FITNESS";


export type HealthCondition =
    | "NONE"
    | "DIABETES"
    | "HYPERTENSION"
    | "HEART_DISEASE"
    | "THYROID"
    | "PCOS"
    | "ARTHRITIS"
    | "DIGESTIVE_ISSUES"
    | "ALLERGIES"
    | "OTHER";


export type WeightLossSpeed = 'SLOW' | 'MODERATE' | 'FAST' | 'VERY_FAST';

export type MealType = 'BREAKFAST'
    | 'LUNCH'
    | 'DINNER'
    | 'SNACK';

export enum ExerciseIntensity {
    LOW = 'LOW',
    MODERATE = 'MODERATE',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}


// Interfaces
export interface User {
    id: number;
    username: string;
    password?: string | null;
    email?: string | null;
    googleId?: string | null;
    profileImage?: string | null;
    createdAt: string; // ISO date string
    updatedAt: string;
    profile?: UserProfile;
}

export interface UserProfile {
    id: number;
    user?: User;
    gender: Gender;
    age: number;
    heightCm: number;
    currentWeightKg: number;
    targetWeightKg: number;
    activityLevel: ActivityLevel;
    goal: Goal;
    weightLossSpeed: WeightLossSpeed;
    dietaryRestriction: DietaryRestriction;
    healthCondition: HealthCondition;
    otherHealthConditionDescription?: string;
    createdAt: string;
    updatedAt: string;
}


export interface GoogleAccountDetails {
    googleId: string;
    email: string;
    name: string;
    photo?: string;
    familyName?: string;
    givenName?: string;
}

export interface DietPlan {
    id: number;
    user?: User;
    planDate: string; // ISO date format, e.g. '2025-07-30'
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    isGenerated: boolean;
    createdAt: string; // ISO datetime format, e.g. '2025-07-30T12:34:56'
    meals: Meal[];
}



export interface Meal {
    id: number;
    dietPlan?: DietPlan; // or full `DietPlan` object if needed or null
    mealType: MealType;
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    preparationTimeMinutes?: number;
    instructions?: string;
    healthBenefits?: string;
    createdAt?: string; // ISO string if coming from JSON
    ingredients: string[];
}


export interface FoodLog {
    id: number;
    user: User;
    dietPlan?: DietPlan;
    mealType: MealType;
    foodName: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    loggedAt: string; // ISO string format
    isFromCamera?: boolean;
    imageDescription?: string;
    createdAt: string; // ISO string format
}

export interface ExerciseLog {
    id: number;
    user: User;
    exerciseName: string;
    durationMinutes: number;
    intensity: ExerciseIntensity;
    caloriesBurned: number;
    loggedAt: string; // ISO string format
    createdAt: string; // ISO string format
}

export interface WaterLog {
    id: number;
    user: User;
    amountMl: number;
    loggedAt: string; // ISO string format
    createdAt: string; // ISO string format
}

export interface DailySummary {
    date: string; // YYYY-MM-DD format
    targetCalories: number;
    consumedCalories: number;
    caloriesBurned: number;
    remainingCalories: number;
    targetProtein: number;
    consumedProtein: number;
    targetCarbs: number;
    consumedCarbs: number;
    targetFat: number;
    consumedFat: number;
    waterConsumedMl: number;
    targetWaterMl: number;
    caloriesProgress: number; // percentage
    proteinProgress: number; // percentage
    carbsProgress: number; // percentage
    fatProgress: number; // percentage
    waterProgress: number; // percentage
}

export interface HealthData {
    summary: DailySummary;
    foodLogs: FoodLog[];
    exerciseLogs: ExerciseLog[];
    waterLogs: WaterLog[];
}


export type CreateFoodLogData = Omit<FoodLog, 'id' | 'createdAt'>;
export type UpdateFoodLogData = Partial<Omit<FoodLog, 'id' | 'user' | 'createdAt'>>;

export type CreateExerciseLogData = Omit<ExerciseLog, 'id' | 'createdAt'>;
export type UpdateExerciseLogData = Partial<Omit<ExerciseLog, 'id' | 'user' | 'createdAt'>>;

export type CreateWaterLogData = Omit<WaterLog, 'id' | 'createdAt'>;
export type UpdateWaterLogData = Partial<Omit<WaterLog, 'id' | 'user' | 'createdAt'>>;
/*=------------------------------CHAT TYPES-----------------------------*/


export interface Conversation {
    id: string;
    userId: number;
    title?: string;
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
}

export type Role = 'USER' | 'BOT';

export interface Message {
    id: number;
    conversationId: Conversation["id"];
    content: string;
    sender: Role;
    createdAt: string;
}

/*=------------------------------STORE TYPES-----------------------------*/

export interface HealthStore {
    // State
    currentDate: string;
    selectedDate: string;
    healthData: HealthData | null;
    isLoading: boolean;
    error: string | null;

    // Basic Actions
    setCurrentDate: (date: string) => void;
    setSelectedDate: (date: string) => void;
    setHealthData: (data: HealthData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Data fetching
    fetchDashboardData: (date?: string) => Promise<void>;
    isValidDateForData: (date: string) => boolean;

    // Food Log Actions
    addFoodLog: (foodLog: CreateFoodLogData) => Promise<FoodLog>;
    updateFoodLog: (id: number, updates: UpdateFoodLogData) => Promise<FoodLog>;
    deleteFoodLog: (id: number) => Promise<void>;
    getFoodLogById: (id: number) => FoodLog | undefined;
    getFoodLogsByMealType: (mealType: MealType) => FoodLog[];
    getFoodLogsByDate: (date: string) => FoodLog[];
    fetchTodaysFoodLogs: () => Promise<FoodLog[]>;
    fetchFoodLogsByMealType: (mealType: MealType) => Promise<FoodLog[]>;

    // Exercise Log Actions
    addExerciseLog: (exerciseLog: CreateExerciseLogData) => Promise<ExerciseLog>;
    updateExerciseLog: (id: number, updates: UpdateExerciseLogData) => Promise<ExerciseLog>;
    deleteExerciseLog: (id: number) => Promise<void>;
    getExerciseLogById: (id: number) => ExerciseLog | undefined;
    getExerciseLogsByDate: (date: string) => ExerciseLog[];
    getExerciseLogsByIntensity: (intensity: ExerciseIntensity) => ExerciseLog[];
    fetchTodaysExerciseLogs: () => Promise<ExerciseLog[]>;
    fetchExerciseTypes: () => Promise<{name: string, metValue: number, category: string}[]>;

    // Water Log Actions
    addWaterLog: (waterLog: CreateWaterLogData) => Promise<WaterLog>;
    addQuickWaterLog: (presetType: 'GLASS' | 'BOTTLE' | 'LARGE') => Promise<WaterLog>;
    updateWaterLog: (id: number, updates: UpdateWaterLogData) => void;
    deleteWaterLog: (id: number) => Promise<void>;
    getWaterLogById: (id: number) => WaterLog | undefined;
    getWaterLogsByDate: (date: string) => WaterLog[];
    fetchTodaysWaterLogs: () => Promise<WaterLog[]>;
    fetchTodaysWaterTotal: () => Promise<number>;

    // Summary Actions
    updateSummary: (summary: Partial<DailySummary>) => void;
    recalculateProgress: () => void;

    // Dashboard & Analytics
    fetchWeeklyDashboard: () => Promise<{
        weeklySummaries: DailySummary[],
        weeklyStats: {
            avgCaloriesConsumed: number,
            avgCaloriesBurned: number,
            avgWaterIntake: number,
            daysOnTrack: number,
            totalDays: number
        }
    }>;

    // Nutrition Sync
    syncTodaysNutrition: () => Promise<DailySummary>;
    syncNutritionByDate: (date: string) => Promise<DailySummary>;

    // Utility Actions
    initializeDefaultData: () => void;
    clearAllData: () => void;
    syncData: (data: HealthData) => void;
    getTotalCaloriesConsumed: () => number;
    getTotalCaloriesBurned: () => number;
    getTotalWaterConsumed: () => number;
    getTotalNutrients: () => { protein: number; carbs: number; fat: number };
}

export interface DietPlanStore {
    // State
    currentDate: string;
    selectedDate: string;
    dietPlan: DietPlan | null;
    isLoading: boolean;
    error: string | null;

    // Basic Actions
    setCurrentDate: (date: string) => void;
    setSelectedDate: (date: string) => void;
    setDietPlan: (dietPlan: DietPlan | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Utility
    isValidDateForData: (date: string) => boolean;

    // Diet Plan Actions
    generateDietPlan: (planDate?: string) => Promise<DietPlan>;
    fetchDietPlan: (date?: string) => Promise<DietPlan>;
    fetchTodaysDietPlan: () => Promise<DietPlan>;
    getMealsByType: (mealType: MealType) => Meal[];
    getMealById: (id: number) => Meal | undefined;

    // Utility Actions
    clearData: () => void;
}


/*=--------------------------------------------------------------------------*/

export interface AuthTokens {
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    user: {
        username: string;
        password: string;
    };
    profile: Omit<UserProfile , "id" | "createdAt" | "updatedAt" >;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}


/*=--------------------------------------------------------------------------*/

export interface NutritionInfoProps {
    calories : number;
    protein : number;
    fat : number;
    carbs : number;
}


export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export interface HeaderProps {
    progress?: number;
    showProgress?: boolean;
}

export interface ActionButtonsProps {
    onSyncHealth?: () => void;
    onSignIn?: () => void;
    onContinue: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export interface HeightSelectorProps {
    onHeightChange?: (height: number, unit: 'cm' | 'ft') => void;
    initialHeight?: number;
    initialUnit?: 'cm' | 'ft';
    gender?: Gender;
    maleAvatarSource?: any;
    femaleAvatarSource?: any;
}

export interface AgePickerProps {
    minAge?: number;
    maxAge?: number;
    initialAge?: number;
    onAgeChange?: (age: number) => void;
}


interface CustomSmoothPickerProps {
    data: (string | number)[];
    selectedValue: string | number;
    onValueChange: (value: string | number) => void;
    itemHeight?: number;
    width?: number;
    highlightColor?: string;
    highlightBgColor?: string;
    textColor?: string;
    selectedTextColor?: string;
}

export interface SelectableCardProps {
    label: string;
    image: any;
    selected?: boolean;
    onPress: () => void;
    className?: string;
    textClassName?: string;
    icon?: string; // Add this line if missing
    showInfoIcon?: boolean; // Add this line if missing
}

export interface OptionsCardProps<T> {
    id: number;
    name: string;
    info: string | null;
    icon: string;
    value: T;
    isSelected?: boolean;
    onPress?: () => void;
}