import { useAuthStore } from "@/store/authStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

const Layout = () => {
  useEffect(() => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      console.log("isAthenticated");
      router.replace("/(root)/(tabs)/tracker");
    }
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default Layout;
