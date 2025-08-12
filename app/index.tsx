// app/index.tsx
import { View, ViewStyle, ActivityIndicator } from "react-native";

export default function Test() {
  // Remove navigation logic from here - let layout.tsx handle it
  return (
    <View
      style={
        { flex: 1, justifyContent: "center", alignItems: "center" } as ViewStyle
      }
    >
      <ActivityIndicator size="large" color="#0de271ff" />
      
    </View>
  );
}
