import FoodItemCard from "@/components/cards/FoodItemCard";
import FoodLogCard from "@/components/cards/FoodLogCard";
import ScreenHeader from "@/components/headers/ScreenHeader";
import { useDateSelectorForHealthStore, useFoodLogs } from "@/store/healthStore";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const FoodLogScreen = () => {
    const { id } = useLocalSearchParams();
    const { selectedDate } = useDateSelectorForHealthStore();

    const { isLoading, getById } = useFoodLogs.ByDate(selectedDate);

    const foodLog = getById(Number(id));

    return (
        <SafeAreaView className="flex-1 bg-white px-2 py-1">

            <ScreenHeader
                title="Food Log"
                iconName="book"
                onPress={() => { }}
            />

            {isLoading && <Text>Loading...</Text>}

            {!isLoading && foodLog && (
                <View className="gap-2">
                    <FoodLogCard foodLog={foodLog} />
                    <View className="mt-4 border-t border-gray-200 pt-2">
                        <Text className="text-lg font-semibold">Items</Text>
                        <View className="flex-row flex-wrap">
                            {foodLog.items.map((item: any) => (
                                // see each item contain calories , carbs , protions , fats
                                <FoodItemCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    quantity={item.quantity}
                                    unit={item.unit}
                                    calories={item.calories}
                                    protein={item.protein}
                                    fats={item.fats}
                                    carbs={item.carbs}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
};


export default FoodLogScreen;