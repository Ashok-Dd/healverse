import { MealType } from "@/types/type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

const PulseButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Function to decide meal type based on time
  const getMealType = (): MealType => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "BREAKFAST";
    if (hour >= 11 && hour < 16) return "LUNCH";
    return "DINNER";
  };

  // Calorie button pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Bounce animation for button press
  const handleButtonPress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  return (
    <View style={styles.container} className="bottom-1 right-1 absolute">
      <Animated.View
        style={[styles.pulseBackground, { transform: [{ scale: pulseAnim }] }]}
      />
      <Animated.View
        style={[
          { transform: [{ scale: bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95]
          }) }] }
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleButtonPress(() => {
              const mealType = getMealType();
              router.push(`/(root)/calorie-counter/${mealType}` as any);
            });
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
      </Animated.View>
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
    backgroundColor: "#22c55e",
    opacity: 0.1,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#22c55e",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default PulseButton;
