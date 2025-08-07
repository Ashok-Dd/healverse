import { Slot, SplashScreen, router } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query-client";
import { useAuthStore } from "@/store/authStore";
import "react-native-gesture-handler";
// Optional: global styles for tailwind or other CSS-in-JS
import "./globals.css";

// Configure Reanimated logs (optional)
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const { checkAuth } = useAuthStore();
  const [appReady, setAppReady] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const bootstrap = async () => {
      await checkAuth();
      setAppReady(true);
      setIsBootstrapping(false); // ✅ Only end bootstrapping here
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (appReady) {
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated) {
        router.replace("/(root)/(tabs)/tracker");
      } else {
        router.replace("/(auth)/welcome");
      }
    }
  }, [appReady]);

  // ✅ Only show loading during first-time bootstrap
  if (!fontsLoaded || isBootstrapping) {
    return null;
  }

  return (
    <QueryClientProvider client={getQueryClient()}>
      <View className={"flex-1 bg-white"}>
        <Slot />
      </View>
    </QueryClientProvider>
  );
}
