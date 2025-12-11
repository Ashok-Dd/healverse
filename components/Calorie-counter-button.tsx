import { MealType } from "@/types/type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

const PulseButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Function to decide meal type based on time
  const getMealType = (): MealType => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "BREAKFAST";
    if (hour >= 11 && hour < 16) return "LUNCH";
    return "DINNER";
  };

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
    <>
    
      <View style={styles.container} className="bottom-28 -left-10 absolute">
        <TouchableOpacity
          style={styles.medButton}
          className="rounded-tr-full rounded-br-full bg-blue-500"
          onPress={() => {
            router.push(`/(root)/(med-tabs)/home` as any);
          }}
        >
          <View className="flex-1 w-full items-center justify-center rounded-full bg-blue-500">
            <View className="flex-row relative items-center space-x-2">
              <MaterialCommunityIcons
                name="plus-box"
                size={24}
                color="white"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container} className="bottom-1 right-1 absolute">
        <Animated.View
          style={[styles.pulseBackground, { transform: [{ scale: pulseAnim }] }]}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const mealType = getMealType();
            router.push(`/(root)/calorie-counter/${mealType}` as any);
          }}
        >
          <View className="flex-1 w-full items-center justify-center rounded-full bg-green-500">
            <View className="flex-row relative items-center space-x-2">
              <MaterialCommunityIcons
                name="food"
                style={{
                  position: "absolute",
                  top: "66%",
                  left: "40%",
                  transform: [{ translateX: -12 }, { translateY: -20 }],
                }}
                size={20}
                color="white"
              />
              <Ionicons name="scan-outline" size={40} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
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
    backgroundColor: "#22c55e",
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

  medButton: {
    width: 70,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default PulseButton;