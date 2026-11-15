import { UserProfile } from '@/types/type';
import { create } from "zustand"

// Base user profile data without actions
export type UserProfileData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> & {
    username : string;
    password : string;
};

// Actions interface
type UserProfileActions = {
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
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
    /** Reset everything to the onboarding defaults (call after a successful registration). */
    clearProfile: () => void;
}

// Combined state type. `targetWeightTouched` is UI state, not part of the API payload.
export type UserProfileState = UserProfileData &
    UserProfileActions & { targetWeightTouched: boolean };

/** Defaults shown when onboarding starts. Every value sits inside its picker's range. */
const INITIAL_PROFILE: UserProfileData = {
    username: '',
    password: '',
    gender: 'MALE',
    age: 25,
    heightCm: 170,
    currentWeightKg: 65,
    targetWeightKg: 65,
    activityLevel: 'SEDENTARY',
    goal: 'MAINTAIN_WEIGHT',
    weightLossSpeed: 'MODERATE',
    dietaryRestriction: 'NONE',
    healthCondition: 'NONE',
    otherHealthConditionDescription: '',
};


export const useUserProfileStore = create<UserProfileState>((set) => ({
    ...INITIAL_PROFILE,
    targetWeightTouched: false,

    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    setGender: (gender) => set({ gender }),
    setAge: (age) => set({ age }),
    setHeightCm: (heightCm) => set({ heightCm }),
    // Until the user sets a target themselves, it follows the current weight.
    setCurrentWeightKg: (currentWeightKg) =>
        set((state) => ({
            currentWeightKg,
            targetWeightKg: state.targetWeightTouched ? state.targetWeightKg : currentWeightKg,
        })),
    setTargetWeightKg: (targetWeightKg) => set({ targetWeightKg, targetWeightTouched: true }),
    setActivityLevel: (activityLevel) => set({ activityLevel }),
    setGoal: (goal) => set({ goal }),
    setWeightLossSpeed: (weightLossSpeed) => set({ weightLossSpeed }),
    setDietaryRestriction: (dietaryRestriction) => set({ dietaryRestriction }),
    setHealthCondition: (healthCondition) =>
        set((state) => ({
            healthCondition,
            // The free-text note only applies to "Other".
            otherHealthConditionDescription:
                healthCondition === 'OTHER' ? state.otherHealthConditionDescription : '',
        })),
    setOtherHealthConditionDescription: (otherHealthConditionDescription) =>
        set({ otherHealthConditionDescription }),

    clearProfile: () => set({ ...INITIAL_PROFILE, targetWeightTouched: false }),
}));
