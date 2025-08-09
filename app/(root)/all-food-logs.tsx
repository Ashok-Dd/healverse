import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const AllFoodLogs = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <View>
      <Text> All Food Logs </Text>
    </View>
  );
};

export default AllFoodLogs;
