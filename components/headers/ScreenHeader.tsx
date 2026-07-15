import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type FeatherIconName = keyof typeof Feather.glyphMap;

interface ScreenHeaderProps {
  title: string;
  iconName: FeatherIconName;
  onPress?: () => void;
}

const ScreenHeader = ({ title, iconName, onPress }: ScreenHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between py-1 border-b border-gray-100">
      {/* Left back button */}
      <TouchableOpacity onPress={() => router.back()} className="p-1">
        <Ionicons name="arrow-back" size={20} color="#374151" />
      </TouchableOpacity>

      {/* Center title with icon */}
      <View className="flex-row items-center absolute left-1/2 -translate-x-1/2">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
          <Feather name={iconName} size={16} color="black" />
        </View>
        <Text className="text-xs font-semibold text-gray-800">{title}</Text>
      </View>

      {/* Right menu button OR placeholder for alignment */}
      {onPress ? (
        <TouchableOpacity onPress={onPress} className="px-3">
          <Ionicons name="ellipsis-vertical" size={20} color="#3b82f6" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} /> // placeholder keeps title centered
      )}
    </View>
  );
};

export default ScreenHeader;
