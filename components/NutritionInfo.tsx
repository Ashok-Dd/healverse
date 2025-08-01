import { NutritionInfoProps } from "@/types/type";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const NutritionInfo = ({
                           calories,
                           protein,
                           fat,
                           carbs,
                       }: NutritionInfoProps) => (
    <View className="flex-row justify-between bg-gray-100 rounded-xl p-4 mb-4">
        <View className="items-center flex flex-row">
            <MaterialCommunityIcons name="fire" size={15} color={"red"} />
            <View className="flex justify-center items-center">
                <Text className="text-lg font-bold text-orange-600">
                    {calories}kcal
                </Text>
                <Text className="text-xs text-gray-500">Calories</Text>
            </View>
        </View>

        <View className="items-center flex flex-row">
            <MaterialCommunityIcons name="food-drumstick" color={"blue"} size={15} />
            <View className="flex justify-center items-center">
                <Text className="text-lg font-bold text-blue-600">{protein}g</Text>
                <Text className="text-xs text-gray-500">Protein</Text>
            </View>
        </View>
        <View className="items-center flex flex-row">
            <Entypo name="drop" color={"orange"} size={15} />
            <View className="flex justify-center items-center">
                <Text className="text-lg font-bold text-orange-600">{fat}g</Text>
                <Text className="text-xs text-gray-500">Fat</Text>
            </View>
        </View>
        <View className="items-center flex flex-row">
            <Entypo name="leaf" color={"green"} size={15} />
            <View className="flex justify-center items-center">
                <Text className="text-lg font-bold text-green-600">{carbs}g</Text>
                <Text className="text-xs text-gray-500">Carbs</Text>
            </View>
        </View>
    </View>
);

export default NutritionInfo;