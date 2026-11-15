import { colors } from "@/constants/theme";
import { ActivityIndicator, View } from "react-native";

/** Shown only while the root layout decides where to send the user. */
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
