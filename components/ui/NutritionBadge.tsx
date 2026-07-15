import {Text, View} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";

interface NutrientBadgeProps {
    iconType?: "Entypo" | "MaterialCommunityIcons";
    iconName: ComponentProps<typeof Entypo>["name"] | ComponentProps<typeof MaterialCommunityIcons>["name"];
    iconColor: string;
    value: number;
    unit: string;
    textColor: string;
}

const NutrientBadge = ({ iconType = "MaterialCommunityIcons", iconName, iconColor, value, unit, textColor }: NutrientBadgeProps) => {
    const IconComponent = iconType === "Entypo" ? Entypo : MaterialCommunityIcons;

    return (
        <View className="flex-row items-center bg-gray-100 rounded-full px-1">
            <Text className="text-xs">
                <IconComponent name={iconName as any} color={iconColor} size={12} />
            </Text>
            <Text className={`text-xs font-semibold ml-1 ${textColor}`}>
                {value}
                {unit}
            </Text>
        </View>
    );
};

export default NutrientBadge;