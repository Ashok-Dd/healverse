import HeightSelector, { feetToCm } from "@/components/HeightSelector";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import { useUserProfileStore } from "@/store/userProfile";
import { Gender } from "@/types/type";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

// Memoized title component to prevent unnecessary re-renders
const HeightSelectionTitle = React.memo(() => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        What is your Height?
    </Text>
));

HeightSelectionTitle.displayName = 'HeightSelectionTitle';

const Step3 = () => {

    const { gender, heightCm, setHeightCm } = useUserProfileStore(
        useShallow((state) => ({
            gender: state.gender,
            heightCm: state.heightCm,
            setHeightCm: state.setHeightCm,
        }))
    );


    const [selectedHeight, setSelectedHeight] = React.useState<number>(100);


    // Use ref to track if we've initialized the height
    const hasInitializedHeight = useRef(false);

    // Memoize the height change handler to prevent recreation on every render
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleHeightChange = useCallback(
        (height: number, unit: 'cm' | 'ft') => {
            const heightInCm = unit === 'cm' ? height : feetToCm(height);

            // Only update local state if different (within 0.5cm tolerance)
            if (Math.abs(heightInCm - selectedHeight) > 0.5) {
                setSelectedHeight(heightInCm);

                // Debounce Zustand update
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    setHeightCm(heightInCm);
                }, 150);
            }
        },
        [selectedHeight, setHeightCm]
    );

// Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // Memoize avatar sources to prevent recreating objects
    const avatarSources = useMemo(() => ({
        male: require('@/assets/images/boy.png'),
        female: require('@/assets/images/girl.png')
    }), []);

    // Initialize height in store only once using useEffect (not during render)
    useEffect(() => {
        if (!hasInitializedHeight.current) {
            hasInitializedHeight.current = true;
            // If heightCm doesn't exist in store, initialize it with selected height or default
            if (!heightCm) {
                const initialHeight = selectedHeight || 170;
                setHeightCm(initialHeight);
                setSelectedHeight(initialHeight);
            } else {
                // If heightCm exists, sync local state with store
                setSelectedHeight(heightCm);
            }
        }
    }, [heightCm, selectedHeight, setHeightCm]);

    // Stable initial values - only calculate, don't mutate state
    const initialValues = useMemo(() => {
        // Use store value if available, otherwise use local state or default
        const height = heightCm || selectedHeight || 170;
        return {
            height: height,
            unit: 'cm' as const
        };
    }, [heightCm, selectedHeight]);

    // Validate height range (optional)
    const isValidHeight = useMemo(() => {
        if (!heightCm) return true;
        return heightCm >= 100 && heightCm <= 250;
    }, [heightCm]);




    return (
        <OnboardingWrapper>
            <View className="flex-1">
                <HeightSelectionTitle />
                <HeightSelector
                    onHeightChange={handleHeightChange}
                    initialHeight={initialValues.height}
                    initialUnit={initialValues.unit}
                    gender={gender as Gender}
                    maleAvatarSource={avatarSources.male}
                    femaleAvatarSource={avatarSources.female}
                />

                {/* Optional: Show validation warning */}
                {!isValidHeight && heightCm && (
                    <View className="px-4 py-2 bg-yellow-100 rounded-lg mx-4 mt-4">
                        <Text className="text-center text-yellow-800 text-sm">
                            Height should be between 100-250 cm
                        </Text>
                    </View>
                )}

                {/* Debug info - remove in production */}
                {__DEV__ && (
                    <View className="px-4 py-2 bg-gray-100 rounded-lg mx-4 mt-4">
                        <Text className="text-center text-gray-600 text-sm">
                            Store: {selectedHeight|| 'undefined'} cm | Initial: {initialValues.height} cm
                        </Text>
                    </View>
                )}
            </View>
        </OnboardingWrapper>
    );
};

export default React.memo(Step3);