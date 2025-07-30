import OnboardingWrapper from "@/components/OnboardingWrapper";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import { Text, View } from "react-native";
import HeightSelector, { feetToCm, cmToFeet } from "@/components/HeightSelector";
import { useUserProfileStore } from "@/store/userProfile";
import { Gender } from "@/types/type";

// Memoized title component to prevent unnecessary re-renders
const HeightSelectionTitle = React.memo(() => (
    <Text className="text-2xl font-jakarta-semi-bold text-center mb-8 text-secondary-800">
        What is your Height?
    </Text>
));

HeightSelectionTitle.displayName = 'HeightSelectionTitle';

const Step3 = () => {

    const { gender, heightCm, setHeightCm } = useUserProfileStore();


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

    // Stable initial values - only set once and don't change
    const initialValues = useMemo(() => {
        // If we haven't initialized yet, set a default
        if (!hasInitializedHeight.current) {
            hasInitializedHeight.current = true;
            // If heightCm exists in store, use it; otherwise default to 170
            const initialHeight = selectedHeight || 170;

            // If heightCm was null/undefined, initialize the store
            if (!heightCm) {
                setHeightCm(initialHeight);
            }

            return {
                height: initialHeight,
                unit: 'cm' as const
            };
        }

        // After initial setup, use the current store value or fallback
        return {
            height: selectedHeight || 170,
            unit: 'cm' as const
        };
    }, []); // Empty dependency array - only calculate once!

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