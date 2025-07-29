import React, { useState } from 'react';
import { View, ScrollView } from "react-native";
import SelectableCard from "@/components/SelectableCard";
import { BOY_OPTIONS, GIRL_OPTIONS } from "@/constants/data";
import {ActivityLevel, Gender} from "@/types/type";

type Props = {
    gender: Gender;
    onSelectionChange?: (selectedValue: ActivityLevel) => void;
    activityLevel?: ActivityLevel;
}

const ActiveDailyBasis: React.FC<Props> = ({ gender, onSelectionChange ,activityLevel }) => {
    const Options = gender === "FEMALE" ? GIRL_OPTIONS : BOY_OPTIONS;

    const handleSelection = (level : ActivityLevel) => {
        onSelectionChange?.(level);
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
                        selected={item.value === activityLevel}
                        onPress={() => handleSelection(item.value)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default ActiveDailyBasis;