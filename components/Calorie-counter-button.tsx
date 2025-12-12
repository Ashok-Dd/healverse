import { MealType } from "@/types/type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PulseButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const medPulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to decide meal type based on time
  const getMealType = (): MealType => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "BREAKFAST";
    if (hour >= 11 && hour < 16) return "LUNCH";
    return "DINNER";
  };

  // Main calorie button pulse animation
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

  // Medication button pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(medPulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(medPulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Floating animation for medication button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
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

  // Tooltip animation
  useEffect(() => {
    const showTooltipTimer = setTimeout(() => {
      setShowTooltip(true);
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto hide tooltip after 3 seconds
      setTimeout(() => {
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowTooltip(false));
      }, 3000);
    }, 2000); // Show tooltip after 2 seconds

    return () => clearTimeout(showTooltipTimer);
  }, []);

  const hideTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTooltip(false));
  };

  return (
    <>
      {/* Medication Button with Enhanced Animation */}
      <View style={styles.container} className="bottom-28 -left-10 absolute">
        {/* Medication button pulse background */}
        <Animated.View
          style={[
            styles.medPulseBackground,
            { transform: [{ scale: medPulseAnim }] }
          ]}
        />
        
        {/* Tooltip for Medication Button */}
        {showTooltip && (
          <Animated.View
            style={[
              styles.tooltip,
              {
                opacity: tooltipOpacity,
                bottom: 80,
                left: 10,
              }
            ]}
          >
            <Text style={styles.tooltipText}>
              📊 Track your medications here!
            </Text>
            <View style={styles.tooltipArrow} />
          </Animated.View>
        )}
        
        <Animated.View
          style={[
            { 
              transform: [
                { scale: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95]
                })},
                { translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -3]
                })}
              ] 
            }
          ]}
        >
          <TouchableOpacity
            style={styles.medButton}
            className="rounded-tr-full rounded-br-full bg-blue-500"
            onPress={() => {
              hideTooltip();
              handleButtonPress(() => {
                router.push(`/(root)/(med-tabs)/home` as any);
              });
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
        </Animated.View>
      </View>

      {/* Calorie Counter Button with Enhanced Animation */}
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
    opacity: 0.4,
  },
  medPulseBackground: {
    position: "absolute",
    width: 85,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3B82F6",
    opacity: 0.3,
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
  medButton: {
    width: 70,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Jakarta",
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -5,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1F2937",
  },
});

export default PulseButton;