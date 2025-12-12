import { useSummaryData } from "@/hooks/useSummaryData";
import { DailySummary } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import CalorieSummary from "./CalorieSummary";
import ErrorCard from "./cards/ErrorCard";
import NutritionInfo from "./NutritionInfo";
import LoggingSkeleton from "./skeleton/LoggingSkeleton";

interface SummarySectionProps {
    date: string;
}

const RenderContent = ({ summary } : { summary: DailySummary }) => (
        <View className="py-2">
            {/* Remaining Calorie Section */}
            <View className="flex-row items-center mb-2 px-5">
                <Text className="text-md mr-2">🏠</Text>
                <Text className="text-md font-semibold text-gray-800">
                    Remaining Calorie
                </Text>

                <TouchableOpacity className="ml-auto">
                    <Feather name="info" color={"skyblue"} size={20} />
                </TouchableOpacity>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 mx-4 mb-4 shadow-sm">
               <CalorieSummary
                  targetCalories={summary?.targetCalories || 0}
                  caloriesBurned={summary?.caloriesBurned || 0}
                  consumedCalories={summary?.consumedCalories || 0}
                  remainingCalories={summary?.remainingCalories || 0}
               />
            </View>

            {/* Daily Total */}
            <View className="px-2">
                <View className="flex-row items-center mb-2 ml-3 ">
                    <Text className="text-2xl mr-2">≡</Text>
                    <Text className="text-md font-semibold text-gray-800">
                        Daily Total
                    </Text>
                </View>
                <NutritionInfo
                    calories={summary?.consumedCalories || 0}
                    carbs={summary?.consumedCarbs || 0}
                    fat={summary?.consumedFat || 0}
                    protein={summary?.consumedProtein || 0}
                    targetCalories={summary?.targetCalories}
                    targetCarbs={summary?.targetCarbs}
                    targetFat={summary?.targetFat}
                    targetProtein={summary?.targetProtein}
                />
            </View>

        </View>
);

const SummarySection: React.FC<SummarySectionProps> = ({ date }) => {

    const {
        data: summary,
        isLoading,
        error,
    } = useSummaryData(date);


    return  isLoading ? (
        <LoggingSkeleton />
    ) : error ? (
        <ErrorCard message={error.message} />
    ) : (
        <RenderContent summary={summary as DailySummary} />
    );
};

export default SummarySection;

