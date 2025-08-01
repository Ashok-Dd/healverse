import Ping from "@/components/Calorie-counter-button";
import { Text, View } from "react-native";

const Profile = () => {
  return (
    <View className=" flex flex-1 items-center justify-center relative border border-red-400 ">
      <Text className="text-green-500 font-bold text-5xl">
        Traacker here ...
      </Text>

      <Ping />
    </View>
  );
};

export default Profile;
