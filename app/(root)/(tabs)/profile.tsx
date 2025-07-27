import { Link } from "expo-router";
import { Text, View } from "react-native";

const Profile = () => {
  return (
    <View className="h-screen flex items-center justify-center ">
      <Text className="text-red-500 font-bold text-5xl">Profile here ...</Text>
      <Link href={"/(root)/calorie-counter"}>Camera capture</Link>
    </View>
  );
};

export default Profile;
