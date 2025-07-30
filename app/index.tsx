// app/index.tsx
import { View, Text } from "react-native";

export default function Index() {
    // Remove navigation logic from here - let layout.tsx handle it
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16 }}>Initializing...</Text>
        </View>
    );
};