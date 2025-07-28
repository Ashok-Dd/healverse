import React, { useState } from 'react';
import { View, ScrollView } from "react-native";
import SelectableCard from "@/components/SelectableCard";
import { BOY_OPTIONS, GIRL_OPTIONS } from "@/constants/data";

type Props = {
    gender: "male" | "female";
    onSelectionChange?: (selectedValue: string | null) => void;
}

const ActiveDailyBasis: React.FC<Props> = ({ gender, onSelectionChange }) => {
    const Options = gender === "female" ? GIRL_OPTIONS : BOY_OPTIONS;
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleSelection = (index: number) => {
        setSelectedIndex(index);
        const selectedOption = Options[index];
        onSelectionChange?.(selectedOption.value);
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
                        selected={index === selectedIndex}
                        onPress={() => handleSelection(index)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default ActiveDailyBasis;