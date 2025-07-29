import { Redirect } from "expo-router";
import {useAuthStore} from "@/store/authStore";

const Page = () => {
  const  { isAuthenticated }  = useAuthStore();

  if (isAuthenticated) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
