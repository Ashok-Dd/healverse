import AppGuidanceProvider from "@/components/providers/AppGuidanceProvider";
import { useTimeZoneSync } from "@/hooks/useTimeZoneSync";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";


const Layout = () => {
  useTimeZoneSync();

  return (
    <BottomSheetModalProvider>
      <AppGuidanceProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppGuidanceProvider>
    </BottomSheetModalProvider>
  );
};

export default Layout;
