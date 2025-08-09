import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDashboardData, useDateSelectorForHealthStore } from "@/store/healthStore";
import {WaterLog} from "@/types/type";



interface WaterLogsComponentProps {
    onEdit?: (logId: number) => void;
    onDelete?: (logId: number) => void;
    onCopyFood?: (logId: number) => void;
}

const WaterLogsComponent: React.FC<WaterLogsComponentProps> = ({
                                                                   onEdit,
                                                                   onDelete,
                                                                   onCopyFood,
                                                               }) => {
    const { selectedDate } = useDateSelectorForHealthStore();
    const { isLoading, error, getWaterLogs } = useDashboardData(selectedDate);

    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const handleMenuPress = (cardId: number, event: any): void => {
        setSelectedCard(cardId);
        const { pageX, pageY } = event.nativeEvent;
        setMenuPosition({ x: pageX - 100, y: pageY + 10 });
        setModalVisible(true);
    };

    const handleEdit = (): void => {
        setModalVisible(false);
        if (selectedCard && onEdit) onEdit(selectedCard);
    };

    const handleDelete = (): void => {
        setModalVisible(false);
        if (selectedCard && onDelete) onDelete(selectedCard);
    };

    const handleCopyFood = (): void => {
        setModalVisible(false);
        if (selectedCard && onCopyFood) onCopyFood(selectedCard);
    };

    const closeModal = (): void => {
        setModalVisible(false);
        setSelectedCard(null);
    };

    const renderWaterCard = (log: WaterLog): React.ReactElement => (
        <View key={log.id} className="mb-3">
            <View className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center mr-3">
                        <Ionicons name="water" size={24} color="#4CAF50" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-black mb-1">Water</Text>
                        <Text className="text-xs text-gray-500 mb-2">{log.loggedAt}</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="water-outline" size={16} color="#2196F3" />
                            <Text className="text-xs text-blue-500 font-medium ml-1">
                                {log.amountMl} mL
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="p-2"
                        onPress={(event) => handleMenuPress(log.id, event)}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <View className="flex-1 justify-center items-center mt-10">
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text className="mt-2 text-gray-500">Loading water logs...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View className="flex-1 justify-center items-center mt-10">
                    <Ionicons name="alert-circle" size={32} color="red" />
                    <Text className="mt-2 text-red-500">Failed to load water logs</Text>
                </View>
            );
        }

        const waterLogs = getWaterLogs();

        if (!waterLogs.length) {
            return (
                <View className="flex-1 justify-center items-center mt-10">
                    <Ionicons name="water-outline" size={32} color="#2196F3" />
                    <Text className="mt-2 text-gray-500">No water logs found</Text>
                </View>
            );
        }

        return waterLogs.map(renderWaterCard);
    };

    return (
        <View className="flex-1">
            {/* Content */}
            <ScrollView className="flex-1 px-4">
                {renderContent()}
            </ScrollView>

            {/* Menu Modal */}
            <Modal transparent visible={modalVisible} onRequestClose={closeModal}>
                <Pressable className="flex-1" onPress={closeModal}>
                    <View
                        className="absolute bg-white rounded-xl w-32 py-1 shadow-2xl border border-gray-100"
                        style={{
                            top: menuPosition.y,
                            right: 20,
                            elevation: 10,
                        }}
                    >
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={handleEdit}
                        >
                            <Text className="text-base text-gray-800 font-normal">Edit</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-gray-150" />

                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={handleDelete}
                        >
                            <Text className="text-base text-gray-800 font-normal">Delete</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-gray-150" />

                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3"
                            onPress={handleCopyFood}
                        >
                            <Text className="text-base text-gray-800 font-normal">
                                Copy Food
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default WaterLogsComponent;
