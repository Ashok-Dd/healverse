import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        height: "100%",
      }}
      className="flex items-center justify-center"
    >
      <Text className="text-red-500 text-5xl font-bold">Index Here</Text>

      <Link href={"/(root)/calorie-counter"}>Camera capture</Link>
    </View>
  );
}
