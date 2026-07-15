import { NutritionInfoProps } from "@/types/type";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  target?: number;
  isExceeded?: boolean;
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
  target,
  isExceeded = false,
}: NutrientItemProps) => {
  const IconComp = iconLib === "Entypo" ? Entypo : MaterialCommunityIcons;

  return (
    <View className="items-center flex flex-row">
      {isExceeded ? (
        <Ionicons
          name="warning"
          size={16}
          color="#EF4444"
          style={{ marginLeft: 4 }}
        />
      ) : (
        <IconComp name={iconName as any} size={20} color={iconColor} />

      )}
      <View className="flex justify-center items-center ml-1">
        <View className="flex-row items-center">
          <Text className={`${valueTextSize} font-bold ${isExceeded ? 'text-red-600' : valueColor}`}>
            {value.toFixed(1)}
            {unit}
          </Text>
        </View>
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
  targetCalories,
  targetProtein,
  targetFat,
  targetCarbs,
}: NutritionInfoProps) => {
  // Check if values exceed their targets
  const isCaloriesExceeded = targetCalories ? calories > targetCalories : false;
  const isProteinExceeded = targetProtein ? protein > targetProtein : false;
  const isFatExceeded = targetFat ? fat > targetFat : false;
  const isCarbsExceeded = targetCarbs ? carbs > targetCarbs : false;

  return (
    <View className={`flex-row justify-between  bg-gray-100 rounded-xl p-4 mb-4`}>
      <NutrientItem
        iconLib="MaterialCommunityIcons"
        iconName="fire"
        iconColor="red"
        value={calories}
        unit="kcal"
        valueColor="text-orange-600"
        label="Calories"
        target={targetCalories}
        isExceeded={isCaloriesExceeded}
      />
      <NutrientItem
        iconLib="MaterialCommunityIcons"
        iconName="food-drumstick"
        iconColor="blue"
        value={protein}
        unit="g"
        valueColor="text-blue-600"
        label="Protein"
        target={targetProtein}
        isExceeded={isProteinExceeded}
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
        target={targetFat}
        isExceeded={isFatExceeded}
      />
      <NutrientItem
        iconLib="Entypo"
        iconName="leaf"
        iconColor="green"
        value={carbs}
        unit="g"
        valueColor="text-green-600"
        label="Carbs"
        target={targetCarbs}
        isExceeded={isCarbsExceeded}
      />
    </View>
  );
};

export default NutritionInfo;
