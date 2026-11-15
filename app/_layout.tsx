import { getQueryClient } from "@/lib/react-query-client";
import { useAuthStore } from "@/store/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
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
  const serverUnreachable = useAuthStore((state) => state.serverUnreachable);

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
      const { isAuthenticated, serverUnreachable } = useAuthStore.getState();
      if (serverUnreachable) return;
      if (isAuthenticated) {
        router.replace("/(root)/(tabs)/tracker");
      } else {
        router.replace("/(auth)/welcome");
      }
    }
  }, [appReady]);

  // Launch-time auth check could not reach the server. The token is kept, so offer a retry
  // instead of logging the user out.
  if (appReady && serverUnreachable) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-xl font-jakarta-bold text-secondary-800 mb-2 text-center">
          Can&apos;t reach the server
        </Text>
        <Text className="text-base font-jakarta-regular text-secondary-600 text-center mb-6">
          Check your internet connection and try again. You&apos;re still signed in.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 py-4 px-10 rounded-3xl"
          onPress={() => {
            useAuthStore.setState({ isInitializing: true });
            checkAuth();
          }}
        >
          <Text className="text-white text-base font-jakarta-semi-bold">Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!appReady) {
    // Matches app.json's expo-splash-screen backgroundColor, so there's no
    // color-mismatch flash in the gap between hideAsync() and Slot mounting —
    // but still shows the brand + a spinner so it doesn't read as frozen.
    return (
      <View style={{ flex: 1, backgroundColor: "#0B8714" }} className="items-center justify-center">
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
