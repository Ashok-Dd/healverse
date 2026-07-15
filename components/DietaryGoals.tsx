import React, { useState } from 'react';
import { View, ScrollView } from "react-native";
import SelectableCard from "@/components/SelectableCard";
import {DIET_BOY_OPTIONS, DIET_GIRL_OPTIONS} from "@/constants/data";
import {DietaryRestriction, Gender, Goal} from "@/types/type";

type Props = {
    gender: Gender;
    onSelectionChange?: (selectedValue:  Goal) => void;
    goal : Goal
}

const DietaryGoals: React.FC<Props> = ({ gender, onSelectionChange , goal}) => {
    const Options = gender === "FEMALE" ? DIET_GIRL_OPTIONS : DIET_BOY_OPTIONS;

    const handleSelection = (value : Goal) => {
        onSelectionChange?.(value);
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {Options.map((item, index) => (
                    <SelectableCard
                        key={item.value}
                        label={item.label}
                        image={item.image}
                        selected={item.value === goal}
                        onPress={() => handleSelection(item.value)}
                        icon={item.icon}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default DietaryGoals;
