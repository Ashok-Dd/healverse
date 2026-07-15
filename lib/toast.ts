import { Alert, ToastAndroid, Platform } from "react-native";

type ToastType = "success" | "error" | "info";

export const showToast = (message: string, { type }: { type?: ToastType } = {}) => {
    if (!message) return;

    // Add emojis or prefixes for visual distinction
    let finalMessage = message;
    if (type === "success") finalMessage = "✅ " + message;
    if (type === "error") finalMessage = "❌ " + message;
    if (type === "info") finalMessage = "ℹ️ " + message;

    if (Platform.OS === "android") {
        ToastAndroid.show(finalMessage, ToastAndroid.SHORT);
    } else {
        // ToastAndroid doesn't exist on iOS/web — Alert is the cross-platform
        // fallback that actually surfaces to the user instead of a console.log.
        Alert.alert(type === "error" ? "Error" : "Notice", finalMessage);
    }
};
