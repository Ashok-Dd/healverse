import { getQueryClient } from "@/lib/react-query-client";
import { useAuthStore } from "@/store/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, ImageSourcePropType, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
// Optional: global styles for tailwind or other CSS-in-JS
import ErrorBoundary from "@/components/providers/ErrorBoundary";
import { images } from "@/constants";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";
// Configure Reanimated logs (optional)
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Keep the native splash screen visible until fonts and the auth check are both ready.
SplashScreen.preventAutoHideAsync();

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

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const appReady = fontsLoaded && !isInitializing;

  useEffect(() => {
    if (fontError) throw fontError;
    if (appReady) SplashScreen.hideAsync();
  }, [appReady, fontError]);

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

  if (!appReady) {
    // Matches app.json's expo-splash-screen backgroundColor, so there's no
    // color-mismatch flash in the gap between hideAsync() and Slot mounting —
    // but still shows the brand + a spinner so it doesn't read as frozen.
    return (
      <View style={{ flex: 1, backgroundColor: "#2e7d32" }} className="items-center justify-center">
        <Image
          source={images.logo as ImageSourcePropType}
          className="w-24 h-24 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-jakarta-bold text-white mb-6">
          Heal<Text className="text-primary-100">Verse</Text>
        </Text>
        <ActivityIndicator size="small" color="#ffffff" />
        <Text className="text-sm font-jakarta-medium text-primary-100 mt-3">
          Setting up your wellness journey...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={getQueryClient()}>
          <NotificationProvider>
            <View className={"flex-1 bg-white"}>
              <Slot />
            </View>
          </NotificationProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
