import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const AllWaterLogs: React.FC = () => {


  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white  border-gray-200">
        <TouchableOpacity className="p-1" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1 justify-center -ml-10">
          <Feather name="clock" size={24} color="#666" />
          <Text className="text-lg font-semibold ml-2 text-black">Water</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#2196F3"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
        >
            <AllWaterLogs/>
        </ScrollView>
    </SafeAreaView>
  );
};

export default AllWaterLogs;
