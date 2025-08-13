import { NutritionInfoProps } from "@/types/type";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type NutrientItemProps = {
  iconLib: "MaterialCommunityIcons" | "Entypo";
  iconName: string;
  iconColor: string;
  value: number;
  unit: string;
  valueColor: string;
  label: string;
  valueTextSize?: string;
};

const NutrientItem = ({
  iconLib,
  iconName,
  iconColor,
  value,
  unit,
  valueColor,
  label,
  valueTextSize = "text-md",
}: NutrientItemProps) => {
  const IconComp = iconLib === "Entypo" ? Entypo : MaterialCommunityIcons;

  return (
    <View className="items-center flex flex-row">
      <IconComp name={iconName as any} size={20} color={iconColor} />
      <View className="flex justify-center items-center ml-1">
        <Text className={`${valueTextSize} font-bold ${valueColor}`}>
          {value.toFixed(1)}
          {unit}
        </Text>
        <Text className="text-xs text-gray-500">{label}</Text>
      </View>
    </View>
  );
};

const NutritionInfo = ({
  calories,
  protein,
  fat,
  carbs,
}: NutritionInfoProps) => (
  <View className="flex-row justify-between bg-gray-100 rounded-xl p-4 mb-4">
    <NutrientItem
      iconLib="MaterialCommunityIcons"
      iconName="fire"
      iconColor="red"
      value={calories}
      unit="kcal"
      valueColor="text-orange-600"
      label="Calories"
    />
    <NutrientItem
      iconLib="MaterialCommunityIcons"
      iconName="food-drumstick"
      iconColor="blue"
      value={protein}
      unit="g"
      valueColor="text-blue-600"
      label="Protein"
    />
    <NutrientItem
      iconLib="Entypo"
      iconName="drop"
      iconColor="orange"
      value={fat}
      unit="g"
      valueColor="text-orange-600"
      label="Fat"
      valueTextSize="text-xs"
    />
    <NutrientItem
      iconLib="Entypo"
      iconName="leaf"
      iconColor="green"
      value={carbs}
      unit="g"
      valueColor="text-green-600"
      label="Carbs"
    />
  </View>
);

export default NutritionInfo;
