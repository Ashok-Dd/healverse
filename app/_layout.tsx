import { SplashScreen, Stack } from "expo-router";
import { useFonts} from "expo-font";
import "./globals.css";
import { useEffect } from "react";

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

  useEffect(() => {
    if(error) throw error;
    if(loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded ) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}/>
  );
}
