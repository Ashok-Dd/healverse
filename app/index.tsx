// app/index.tsx
import {View, Text, ViewStyle, TextStyle} from "react-native";

export default function Test() {
    // Remove navigation logic from here - let layout.tsx handle it
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" } as ViewStyle}>
            <Text style={{ fontSize: 16 } as TextStyle}>Initializing...</Text>
        </View>
    );
}