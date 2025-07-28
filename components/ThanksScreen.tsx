import React, { useState } from 'react';
import { View, ScrollView } from "react-native";
import SelectableCard from "@/components/SelectableCard";
import { THANKS_BOY_OPTIONS, THANKS_GIRL_OPTIONS } from "@/constants/data";

type Props = {
    gender: "male" | "female";
    onSelectionChange?: (selectedValue: string | null) => void;
}

const ThanksScreen: React.FC<Props> = ({ gender, onSelectionChange }) => {
    const Options = gender === "female" ? THANKS_GIRL_OPTIONS : THANKS_BOY_OPTIONS;
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0); // Default to first option

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
                        icon={item.icon}
                        selected={index === selectedIndex}
                        onPress={() => handleSelection(index)}
                        showInfoIcon={false} // Hide info icon for this screen
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default ThanksScreen;