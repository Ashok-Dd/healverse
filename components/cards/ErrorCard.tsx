import {
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface ErrorCardProps {
    message: string;
    onPress?: () => void;
}

const ErrorCard = ({
    message,
    onPress,
}: ErrorCardProps) => { 
    return (
        <View className="bg-red-100 p-4 rounded-lg m-4">
            <Text className="text-red-600 font-semibold mb-2">⚠ Oops!</Text>
            <Text className="text-red-500 mb-3">
                {message || "Something went wrong while loading your dashboard."}
            </Text>
            {onPress && (
                <TouchableOpacity
                    onPress={() => onPress()}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            )}
        </View>
    )
};

export default ErrorCard;