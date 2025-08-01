import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

const PulseButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container} className="bottom-1  right-1 absolute ">
      <Animated.View
        style={[styles.pulseBackground, { transform: [{ scale: pulseAnim }] }]}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(root)/calorie-counter")}
      >
        <View className="flex-1 w-full items-center justify-center rounded-full bg-green-500">
          <View className="flex-row relative items-center space-x-2">
            <MaterialCommunityIcons
              name="food"
              className="absolute top-2/3 left-1/2 transform -translate-y-5 -translate-x-6"
              size={20}
              color="white"
            />
            <Ionicons name="scan-outline" size={40} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  pulseBackground: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#22c55e", // green-500
    opacity: 0.5,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  image: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    // backgroundColor: "white",
  },
});

export default PulseButton;
