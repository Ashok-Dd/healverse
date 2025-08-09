// CalorieMeterPage.tsx - Fixed Version
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFoodLogMutations } from "@/store/healthStore";

// Header Component
interface HeaderProps {
    isTextInputActive: boolean;
    onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ isTextInputActive, onBack }) => {
    return (
        <View className="flex w-full flex-row items-center justify-between px-5">
            <TouchableOpacity onPress={onBack}>
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
    );
};

// TextInputSection Component
interface TextInputSectionProps {
    isActive: boolean;
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onContinue: () => void;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
                                                               isActive,
                                                               value,
                                                               onChangeText,
                                                               onFocus,
                                                               onContinue,
                                                           }) => {
    if (isActive) {
        return (
            <View className="flex-1 px-5 pt-8">
                <TextInput
                    className="bg-gray-100 p-4 rounded-lg text-base text-black min-h-32"
                    placeholder="Describe your food here..."
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                    autoFocus
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    className="bg-green-500 py-4 px-8 rounded-3xl items-center mt-6"
                    onPress={onContinue}
                >
                    <Text className="text-white text-base font-bold">Continue</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="px-5 pb-4 min-h-52">
            <TouchableOpacity onPress={onFocus}>
                <View className="bg-gray-100 p-2 min-h-28 gap-2 flex flex-row items-center rounded-lg">
                    <Feather name="edit-2" size={20} color="gray" />
                    <Text className="flex-1 flex-wrap text-gray-400">
                        Please enter a prompt describing the food you'd like to scan (e.g.,
                        'a bowl of fresh salad with tomatoes and cucumbers') instead of
                        uploading an image.
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// Spinning loader component with consistent animation
interface SpinnerProps {
    size?: 'small' | 'large';
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'small', color = 'white' }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        );
        spinAnimation.start();

        return () => spinAnimation.stop();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const sizeClasses = size === 'large' ? 'w-12 h-12 border-4' : 'w-8 h-8 border-2';
    const borderColor = color === 'white' ? 'border-white' : 'border-green-500';

    return (
        <Animated.View
            className={`${sizeClasses} ${borderColor} border-t-transparent rounded-full`}
            style={{ transform: [{ rotate: spin }] }}
        />
    );
};

// ProcessingOverlay Component
const ProcessingOverlay: React.FC = () => {
    return (
        <View className="flex-1 max-h-[330px] w-full bg-black/50 rounded-3xl items-center justify-center">
            <View className="bg-white/90 rounded-2xl p-6 items-center">
                <View className="mb-3">
                    <Spinner size="large" color="green" />
                </View>
                <Text className="text-black text-lg font-semibold">Processing...</Text>
                <Text className="text-gray-600 text-sm mt-1">Analyzing your image</Text>
            </View>
        </View>
    );
};

// CameraSection Component
interface CameraSectionProps {
    isProcessing: boolean;
    capturedImage: string | null;
    cameraType: CameraType;
    cameraRef: React.RefObject<CameraView | null>;
}

const CameraSection: React.FC<CameraSectionProps> = ({
                                                         isProcessing,
                                                         capturedImage,
                                                         cameraType,
                                                         cameraRef,
                                                     }) => {
    return (
        <View style={styles.cameraContainer}>
            {isProcessing ? (
                <ProcessingOverlay />
            ) : capturedImage ? (
                <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            ) : (
                <CameraView style={styles.camera} facing={cameraType} ref={cameraRef}>
                    {/*<View style={styles.cameraOverlay} />*/}
                </CameraView>
            )}
        </View>
    );
};

// CameraButton Component - Fixed to prevent remounting
interface CameraButtonProps {
    capturedImage: string | null;
    isCapturing: boolean;
    isProcessing: boolean;
    onTakePicture: () => void;
    onAcceptImage: () => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({
                                                       capturedImage,
                                                       isCapturing,
                                                       isProcessing,
                                                       onTakePicture,
                                                       onAcceptImage,
                                                   }) => {
    const isLoading = isCapturing || isProcessing;

    return (
        <TouchableOpacity
            key="camera-button"
            className={`w-24 h-24 rounded-full justify-center items-center p-1 border border-green-400 ${
                isLoading ? "opacity-70" : ""
            }`}
            onPress={capturedImage ? onAcceptImage : onTakePicture}
            disabled={isLoading}
        >
            <View className="flex-1 w-full items-center justify-center rounded-full bg-green-500">
                {isLoading ? (
                    <Spinner size="small" color="white" />
                ) : capturedImage ? (
                    <Ionicons key="checkmark" name="checkmark" size={40} color="white" />
                ) : (
                    <View key="scan-icon" className="flex-row relative items-center space-x-2">
                        <MaterialCommunityIcons
                            name="food"
                            className="absolute top-1/2 left-1/2 transform -translate-y-5 -translate-x-6"
                            size={28}
                            color="white"
                        />
                        <Ionicons name="scan-outline" size={60} color="white" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

// CameraControls Component - Refactored for consistency
interface CameraControlsProps {
    capturedImage: string | null;
    isCapturing: boolean;
    isProcessing: boolean;
    onPickImage: () => void;
    onTakePicture: () => void;
    onAcceptImage: () => void;
    onCancelCapture: () => void;
    onFlipCamera: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
                                                           capturedImage,
                                                           isCapturing,
                                                           isProcessing,
                                                           onPickImage,
                                                           onTakePicture,
                                                           onAcceptImage,
                                                           onCancelCapture,
                                                           onFlipCamera,
                                                       }) => {
    return (
        <View className="px-5 pb-10">
            <View className="flex-row justify-between items-center px-5">
                {/* Left Button - Image Picker or Empty View */}
                <View key="left-control" className="w-12 h-12 items-center justify-center">
                    {!capturedImage ? (
                        <TouchableOpacity
                            className={`items-center justify-center w-12 h-12 rounded-full ${
                                isProcessing ? "opacity-50" : ""
                            }`}
                            onPress={onPickImage}
                            disabled={isProcessing}
                        >
                            <Feather name="image" size={32} color="black" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Center Button - Capture or Accept */}
                <CameraButton
                    capturedImage={capturedImage}
                    isCapturing={isCapturing}
                    isProcessing={isProcessing}
                    onTakePicture={onTakePicture}
                    onAcceptImage={onAcceptImage}
                />

                {/* Right Button - Camera Flip or Cancel */}
                <View key="right-control" className="w-12 h-12 items-center justify-center">
                    {!capturedImage ? (
                        <TouchableOpacity
                            className={`items-center justify-center w-12 h-12 rounded-full ${
                                isProcessing ? "opacity-50" : ""
                            }`}
                            onPress={onFlipCamera}
                            disabled={isProcessing}
                        >
                            <Feather name="refresh-ccw" size={32} color="black" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className={`items-center justify-center w-12 h-12 rounded-full ${
                                isProcessing ? "opacity-50" : ""
                            }`}
                            onPress={onCancelCapture}
                            disabled={isProcessing}
                        >
                            <Ionicons name="close" size={30} color="black" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

// PermissionScreen Component
interface PermissionScreenProps {
    message: string;
    buttonText?: string;
    onPress?: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({
                                                               message,
                                                               buttonText,
                                                               onPress,
                                                           }) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Text className="text-black text-center text-base m-5">{message}</Text>
            {buttonText && onPress && (
                <TouchableOpacity
                    className="bg-green-500 mx-5 py-4 px-8 rounded-3xl items-center"
                    onPress={onPress}
                >
                    <Text className="text-white text-base font-bold">{buttonText}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

// Main CalorieMeterPage Component
interface CalorieMeterPageProps {}

const CalorieMeterPage: React.FC<CalorieMeterPageProps> = () => {
    const router = useRouter();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>("back");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTextInputActive, setIsTextInputActive] = useState(false);
    const [textInput, setTextInput] = useState("");
    const cameraRef = useRef<CameraView | null>(null);

    const { addFoodLog } = useFoodLogMutations();

    // Request camera permission if not granted
    useEffect(() => {
        if (cameraPermission && !cameraPermission.granted) {
            requestCameraPermission();
        }
    }, [cameraPermission, requestCameraPermission]);

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing && !isProcessing) {
            try {
                setIsCapturing(true);
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });

                if (photo && photo.uri) {
                    setIsProcessing(true);
                    // Simulate processing time for better UX
                    setTimeout(() => {
                        console.log(photo.uri);
                        setCapturedImage(photo.uri);
                        setIsProcessing(false);
                    }, 800);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to take picture");
                console.error(error);
                setIsProcessing(false);
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

    const cancelCapture = () => {
        setCapturedImage(null);
        setIsProcessing(false);
    };

    const acceptImage = () => {
        if (!capturedImage) {
            Alert.alert("Error", "No image captured");
            return;
        }

        const formData = new FormData();

        console.log("Accepting : " , capturedImage);

        // Fix: Properly format the image object for FormData
        formData.append("image", {
            uri: capturedImage,
            name: "meal.jpg",
            type: "image/jpeg",
        } as any);

        formData.append("mealType", "BREAKFAST");
        formData.append("loggedAt", new Date().toISOString());

        addFoodLog.mutate(formData);

        router.push("/(root)/(tabs)/tracker");
    };

    const handleTextInputFocus = () => {
        setIsTextInputActive(true);
    };

    const handleContinuePress = () => {
        if (textInput.trim()) {
            router.push("/(root)/all-food-logs");
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

    const handleBack = () => {
        if (isTextInputActive) {
            handleBackFromTextInput();
        } else {
            router.back();
        }
    };

    const handleFlipCamera = () => {
        setCameraType(cameraType === "back" ? "front" : "back");
    };

    // Permission screens
    if (!cameraPermission) {
        return <PermissionScreen message="Requesting camera permissions..." />;
    }

    if (!cameraPermission.granted) {
        return (
            <PermissionScreen
                message="Camera access is required for this feature."
                buttonText="Grant Camera Permission"
                onPress={requestCameraPermission}
            />
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Header isTextInputActive={isTextInputActive} onBack={handleBack} />

            {/* Text Input Field (when active, moves to top) */}
            {isTextInputActive && (
                <TextInputSection
                    isActive={isTextInputActive}
                    value={textInput}
                    onChangeText={setTextInput}
                    onFocus={handleTextInputFocus}
                    onContinue={handleContinuePress}
                />
            )}

            {/* Camera or Captured Image (hidden when text input is active) */}
            {!isTextInputActive && (
                <>
                    <CameraSection
                        isProcessing={isProcessing}
                        capturedImage={capturedImage}
                        cameraType={cameraType}
                        cameraRef={cameraRef}
                    />

                    {/* Text Input Field (when not active, appears under camera) */}
                    <TextInputSection
                        isActive={false}
                        value={textInput}
                        onChangeText={setTextInput}
                        onFocus={handleTextInputFocus}
                        onContinue={handleContinuePress}
                    />

                    <CameraControls
                        capturedImage={capturedImage}
                        isCapturing={isCapturing}
                        isProcessing={isProcessing}
                        onPickImage={pickImage}
                        onTakePicture={takePicture}
                        onAcceptImage={acceptImage}
                        onCancelCapture={cancelCapture}
                        onFlipCamera={handleFlipCamera}
                    />
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
        maxHeight: 330,
        width: "100%",
        resizeMode: "cover",
        borderRadius: 20,
    },
});