import { UserProfile } from '@/types/type';
import { create } from "zustand"

// Base user profile data without actions
export type UserProfileData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> & {
    username : string;
};

// Actions interface
type UserProfileActions = {
    setUsername: (username: string) => void;
    setGender: (gender: UserProfileData['gender']) => void;
    setAge: (age: number) => void;
    setHeightCm: (height: number) => void;
    setCurrentWeightKg: (weight: number) => void;
    setTargetWeightKg: (weight: number) => void;
    setActivityLevel: (level: UserProfileData['activityLevel']) => void;
    setGoal: (goal: UserProfileData['goal']) => void;
    setWeightLossSpeed: (speed: UserProfileData['weightLossSpeed']) => void;
    setDietaryRestriction: (restriction: UserProfileData['dietaryRestriction']) => void;
    setHealthCondition: (condition: UserProfileData['healthCondition']) => void;
    setOtherHealthConditionDescription: (description: string) => void;
    updateProfile: (updates: Partial<UserProfileData>) => void;
    clearProfile: () => void;
}

// Combined state type
export type UserProfileState = UserProfileData & UserProfileActions;


export const useUserProfileStore = create<UserProfileState>((set, get) => ({
    username : '',
    gender: 'MALE',
    age: 20,
    heightCm: 170,
    currentWeightKg: 50,
    targetWeightKg: 50,
    activityLevel: "SEDENTARY",
    goal: "LOSE_WEIGHT",
    weightLossSpeed: "MODERATE",
    dietaryRestriction: "VEGAN",
    healthCondition: 'NONE' as const,
    otherHealthConditionDescription: '',

    // Individual field setters

    setUsername : (username) => set({ username }),
    setGender: (gender) => set({ gender }),
    setAge: (age) => set({ age }),
    setHeightCm: (height) => set({ heightCm: height }),
    setCurrentWeightKg: (weight) => set({ currentWeightKg: weight }),
    setTargetWeightKg: (weight) => set({ targetWeightKg: weight }),
    setActivityLevel: (level) => set({ activityLevel: level }),
    setGoal: (goal) => set({ goal }),
    setWeightLossSpeed: (speed) => set({ weightLossSpeed: speed }),
    setDietaryRestriction: (restriction) => set({ dietaryRestriction: restriction }),
    setHealthCondition: (condition) => set({ healthCondition: condition }),
    setOtherHealthConditionDescription: (description) => set({ otherHealthConditionDescription: description }),

    // Bulk update function
    updateProfile: (updates) => set((state) => ({ ...state, ...updates })),

    // Clear all data (set to empty/zero values)
    clearProfile: () => set({
        gender: 'MALE',
        age: 0,
        heightCm: 0,
        currentWeightKg: 0,
        targetWeightKg: 0,
        activityLevel: 'SEDENTARY',
        goal: 'MAINTAIN_WEIGHT',
        weightLossSpeed: 'MODERATE',
        dietaryRestriction: 'NONE',
        healthCondition: 'NONE',
        otherHealthConditionDescription: '',
    }),

}));