import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CalorieMeterPageProps {}

const CalorieMeterPage: React.FC<CalorieMeterPageProps> = () => {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [textInput, setTextInput] = useState("");
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: imagePickerStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      setMediaPermission(
        mediaStatus === "granted" && imagePickerStatus === "granted"
      );
    })();
  }, []);

  // Request camera permission if not granted
  useEffect(() => {
    if (cameraPermission && !cameraPermission.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo && photo.uri) {
          setCapturedImage(photo.uri);

          // Save to media library
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          Alert.alert("Success", "Photo captured and saved to gallery!");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
        console.error(error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const analyzeCalories = () => {
    // Placeholder for calorie analysis functionality
    Alert.alert("Analysis", "Calorie analysis feature coming soon!");
  };

  const handleTextInputFocus = () => {
    setIsTextInputActive(true);
  };

  const handleContinuePress = () => {
    if (textInput.trim()) {
      // Use the same analyze calories function
      analyzeCalories();
      // Clear the input and return to camera view
      setTextInput("");
      setIsTextInputActive(false);
    } else {
      Alert.alert("Error", "Please enter some text first");
    }
  };

  const handleBackFromTextInput = () => {
    setIsTextInputActive(false);
    setTextInput("");
  };

  if (!cameraPermission) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-black text-center text-base m-5">
          Requesting camera permissions...
        </Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-black text-center text-base m-5">
          Camera access is required for this feature.
        </Text>
        <TouchableOpacity
          className="bg-green-500 mx-5 py-4 px-8 rounded-3xl items-center"
          onPress={requestCameraPermission}
        >
          <Text className="text-white text-base font-bold">
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (mediaPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-black text-center text-base m-5">
          Requesting media permissions...
        </Text>
      </SafeAreaView>
    );
  }

  if (mediaPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-black text-center text-base m-5">
          Media library access is required for this feature.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex w-full flex-row items-center justify-between px-5">
        <TouchableOpacity
          onPress={
            isTextInputActive ? handleBackFromTextInput : () => router.back()
          }
        >
          <Ionicons name="arrow-back" color={"black"} size={25} />
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-center gap-x-2">
          <Ionicons name="qr-code-outline" size={20} color="black" />
          <Text className="text-black text-base font-bold">LogFood</Text>
        </View>

        <Link
          href={"/"}
          className="flex items-center justify-center bg-blue-200 rounded-full p-1"
        >
          <Ionicons name="help" color={"blue"} size={12} />
        </Link>
      </View>

      {/* Text Input Field (when active, moves to top) */}
      {isTextInputActive && (
        <View className="flex-1 px-5 pt-8">
          <TextInput
            className="bg-gray-100 p-4 rounded-lg text-base text-black min-h-32"
            placeholder="Describe your food here..."
            placeholderTextColor="#9CA3AF"
            value={textInput}
            onChangeText={setTextInput}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          <TouchableOpacity
            className="bg-green-500 py-4 px-8 rounded-3xl items-center mt-6"
            onPress={handleContinuePress}
          >
            <Text className="text-white text-base font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Camera or Captured Image (hidden when text input is active) */}
      {!isTextInputActive && (
        <>
          <View style={styles.cameraContainer}>
            {capturedImage ? (
              <Image
                source={{ uri: capturedImage }}
                style={styles.capturedImage}
              />
            ) : (
              <CameraView
                style={styles.camera}
                facing={cameraType}
                ref={cameraRef}
              >
                <View style={styles.cameraOverlay} />
              </CameraView>
            )}
          </View>

          {/* Text Input Field (when not active, appears under camera) */}
          <View className="px-5 pb-4 min-h-52">
            <TouchableOpacity onPress={handleTextInputFocus}>
              <View className="bg-gray-100 p-2 min-h-28 gap-2 flex flex-row items-center rounded-lg">
                <Feather name="edit-2" size={20} color="gray" />
                <Text className="flex-1 flex-wrap  text-gray-400">
                  Please enter a prompt describing the food you'd like to scan
                  (e.g., 'a bowl of fresh salad with tomatoes and cucumbers')
                  instead of uploading an image.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Controls (hidden when text input is active) */}
          <View className="px-5 pb-10">
            {capturedImage ? (
              <View className="flex-row justify-around items-center">
                <TouchableOpacity
                  className="bg-red-500 px-8 py-4 rounded-3xl"
                  onPress={retakePhoto}
                >
                  <Text className="text-white text-base font-bold">Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-green-500 px-8 py-4 rounded-3xl"
                  onPress={analyzeCalories}
                >
                  <Text className="text-white text-base font-bold">
                    Analyze Calories
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row justify-between items-center px-5">
                {/* Image Picker Button */}
                <TouchableOpacity
                  className="items-center justify-center w-12 h-12 rounded-full"
                  onPress={pickImage}
                >
                  <Feather name="image" size={32} color="black" />
                </TouchableOpacity>

                {/* Capture Button */}
                <TouchableOpacity
                  className={`w-24 h-24 rounded-full justify-center items-center p-1 border border-green-400 ${
                    isCapturing ? "opacity-70" : ""
                  }`}
                  onPress={takePicture}
                  disabled={isCapturing}
                >
                  <View className="flex-1 w-full items-center justify-center rounded-full bg-green-500">
                    <View className="flex-row relative items-center space-x-2">
                      <MaterialCommunityIcons
                        name="food"
                        className="absolute top-1/2 left-1/2 transform -translate-y-5 -translate-x-6"
                        size={28}
                        color="white"
                      />
                      <Ionicons name="scan-outline" size={60} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Camera Flip Button */}
                <TouchableOpacity
                  className="items-center justify-center w-15 h-15 rounded-full"
                  onPress={() => {
                    setCameraType(cameraType === "back" ? "front" : "back");
                  }}
                >
                  <Feather name="refresh-ccw" size={32} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CalorieMeterPage;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    maxHeight: 330,
    borderRadius: 20,
    width: "100%",
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  capturedImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
});
