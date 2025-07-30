import {router, Stack} from "expo-router";
import {useEffect} from "react";
import {useAuthStore} from "@/store/authStore";

const Layout = () => {


  useEffect(() => {
    const {isAuthenticated} = useAuthStore.getState();

    if (isAuthenticated) {
      console.log("isAthenticated");
      router.replace("/(root)/(tabs)/home");
    }

    return () => {

    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default Layout;
