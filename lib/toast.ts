import { ToastAndroid, Platform } from "react-native";

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
        // On iOS or Web, just log for now (or integrate another library like react-native-toast-message)
        console.log(`[${type ?? "info"}] ${message}`);
    }
};
