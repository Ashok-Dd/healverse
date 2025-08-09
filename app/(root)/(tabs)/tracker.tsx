import Ping from "@/components/Calorie-counter-button";
import { Text, View } from "react-native";
import FoodLoggingTrackerCard from "@/components/cards/FoodLoggingTrackerCard";

const Profile = () => {
  return (
    <View className=" flex flex-1 items-center justify-center relative border border-red-400 ">
        <Text>Hello</Text>
      <FoodLoggingTrackerCard/>
      <Ping />
    </View>
  );
};

export default Profile;
