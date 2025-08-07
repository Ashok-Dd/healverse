import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();

    router.replace("/(auth)/welcome");
  };
  return (
    <View className="h-screen flex items-center justify-center ">
      <Text className="text-blue-500 font-bold text-5xl">Account here ...</Text>

      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
