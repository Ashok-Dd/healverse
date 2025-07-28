import React from "react";

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
    gender?: 'male' | 'female';
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


