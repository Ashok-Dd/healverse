import React from "react";

// Enums

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type ActivityLevel =
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'EXTREMELY_ACTIVE';

export type DietaryRestriction = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'EGGETARIAN' | 'NONE';

export type Goal = 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTAIN_WEIGHT' | 'MUSCLE_GAIN';

export type HealthCondition =
    | 'NONE'
    | 'HIGH_BLOOD_PRESSURE'
    | 'DIABETES'
    | 'HIGH_CHOLESTEROL'
    | 'OTHER';

export type WeightLossSpeed = 'SLOW' | 'MODERATE' | 'FAST';


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
    profile: Omit<UserProfile , "id">;
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