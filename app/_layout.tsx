import { useAuthStore } from "@/store/authStore";
import { useFonts } from "expo-font";
import { router, Slot, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import "./globals.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  // const router = useRouter();
  const { checkAuth, isLoading } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  useEffect(() => {
    const bootstrap = async () => {
      await checkAuth();
      setAppReady(true); // Ensure layout has rendered before navigating
    };
    bootstrap();
  }, []);

  // useEffect(() => {
  //   if (appReady && !isLoading) {
  //     const { isAuthenticated } = useAuthStore.getState();
  //     console.log("isAuthenticated", isAuthenticated);
  //     if (isAuthenticated) {
  //       router.replace("/(root)/(tabs)/tracker");
  //     } else {
  //       router.replace("/(auth)/welcome");
  //     }
  //   }
  // }, [appReady, isLoading]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return <Slot screenOptions={{ headerShown: false }} />;
}
