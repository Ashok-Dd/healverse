import { getQueryClient } from "@/lib/react-query-client";
import { NavigationThemeProvider } from "@/components/providers/NavigationThemeProvider";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { Fredoka_600SemiBold, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";
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
import { Button } from "@/components/ui/Button";
import { useThemeColors } from "@/constants/theme";
import { images } from "@/constants";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/lib/icons";
import "./globals.css";
// Configure Reanimated logs (optional)
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Keep the native splash screen visible until fonts and the auth check are both ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colors = useThemeColors();
  const [fontsLoaded, fontError] = useFonts({
    "Fredoka-SemiBold": Fredoka_600SemiBold,
    "Fredoka-Bold": Fredoka_700Bold,
    "Nunito-Regular": Nunito_400Regular,
    "Nunito-SemiBold": Nunito_600SemiBold,
    "Nunito-Bold": Nunito_700Bold,
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

  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrateTheme();
    checkAuth();
  }, [hydrateTheme, checkAuth]);

  const themeHydrated = useThemeStore((s) => s.hydrated);
  const appReady = fontsLoaded && !isInitializing && themeHydrated;

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
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="mb-2 text-center font-display-bold text-2xl text-foreground">
          Can&apos;t reach the server
        </Text>
        <Text className="mb-6 text-center font-body text-base text-muted-foreground">
          Check your internet connection and try again. You&apos;re still signed in.
        </Text>
        <Button
          title="Try again"
          onPress={() => {
            useAuthStore.setState({ isInitializing: true });
            checkAuth();
          }}
        />
      </View>
    );
  }

  if (!appReady) {
    // Same colour as the native splash (app.json), so there is no flash in the gap between
    // hideAsync() and the first screen. No text: the custom fonts are not loaded yet.
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Image
          source={images.logo as ImageSourcePropType}
          className="mb-6 h-24 w-24"
          resizeMode="contain"
        />
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={getQueryClient()}>
          <NotificationProvider>
            <NavigationThemeProvider>
              <View className="flex-1 bg-background">
                <Slot />
              </View>
            </NavigationThemeProvider>
          </NotificationProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
