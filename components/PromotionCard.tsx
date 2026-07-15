import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface PromoteCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    onPress?: () => void;
    onButtonPress?: () => void;
    image?: ImageSourcePropType;
    icon?: React.ReactNode;
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "info"
        | "dark"
        | "purple";
    size?: "small" | "medium" | "large";
    hasButton?: boolean;
    hasShadow?: boolean;
    borderRadius?: "sm" | "md" | "lg" | "xl" | "2xl";
    style?: ViewStyle;
    disabled?: boolean;
}

const PromoteCard: React.FC<PromoteCardProps> = ({
                                                     title,
                                                     subtitle,
                                                     description,
                                                     buttonText = "Get Started",
                                                     onPress,
                                                     onButtonPress,
                                                     image,
                                                     icon,
                                                     variant = "primary",
                                                     size = "medium",
                                                     hasButton = true,
                                                     hasShadow = true,
                                                     borderRadius = "xl",
                                                     style,
                                                     disabled = false,
                                                 }) => {
    // Variant color schemes using NativeWind classes
    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case "primary":
                return {
                    background: "bg-gradient-to-br from-blue-500 to-purple-600",
                    fallbackBg: "bg-blue-500",
                };
            case "secondary":
                return {
                    background: "bg-gradient-to-br from-pink-500 to-rose-500",
                    fallbackBg: "bg-pink-500",
                };
            case "success":
                return {
                    background: "bg-gradient-to-br from-emerald-500 to-teal-500",
                    fallbackBg: "bg-emerald-500",
                };
            case "warning":
                return {
                    background: "bg-gradient-to-br from-amber-400 to-orange-500",
                    fallbackBg: "bg-amber-400",
                };
            case "info":
                return {
                    background: "bg-gradient-to-br from-cyan-400 to-blue-500",
                    fallbackBg: "bg-cyan-400",
                };
            case "dark":
                return {
                    background: "bg-gradient-to-br from-gray-800 to-gray-900",
                    fallbackBg: "bg-gray-800",
                };
            case "purple":
                return {
                    background: "bg-gradient-to-br from-purple-500 to-indigo-600",
                    fallbackBg: "bg-purple-500",
                };
            default:
                return {
                    background: "bg-gradient-to-br from-blue-500 to-purple-600",
                    fallbackBg: "bg-blue-500",
                };
        }
    };

    // Size configurations
    const getSizeConfig = (size: string) => {
        switch (size) {
            case "small":
                return {
                    padding: "p-4",
                    titleSize: "text-lg",
                    subtitleSize: "text-sm",
                    descriptionSize: "text-xs",
                    buttonPadding: "px-4 py-2",
                    buttonTextSize: "text-xs",
                    imageSize: "w-12 h-12",
                    minHeight: "min-h-[120px]",
                };
            case "large":
                return {
                    padding: "p-8",
                    titleSize: "text-3xl",
                    subtitleSize: "text-lg",
                    descriptionSize: "text-base",
                    buttonPadding: "px-8 py-4",
                    buttonTextSize: "text-lg",
                    imageSize: "w-32 h-32",
                    minHeight: "min-h-[250px]",
                };
            default: // medium
                return {
                    padding: "p-6",
                    titleSize: "text-xl",
                    subtitleSize: "text-base",
                    descriptionSize: "text-sm",
                    buttonPadding: "px-6 py-3",
                    buttonTextSize: "text-base",
                    imageSize: "w-24 h-24",
                    minHeight: "min-h-[180px]",
                };
        }
    };

    const variantStyles = getVariantStyles(variant);
    const sizeConfig = getSizeConfig(size);

    const borderRadiusClass = `rounded-${borderRadius}`;
    const shadowClass = hasShadow ? "shadow-lg shadow-black/10 elevation-8" : "";
    const opacityClass = disabled ? "opacity-60" : "";

    const CardContent = () => (
        <View
            className={`${sizeConfig.padding} flex-1 ${sizeConfig.minHeight} justify-between`}
        >
            {/* Header Section */}
            <View>
                <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-1 pr-4">
                        {subtitle && (
                            <Text
                                className={`${sizeConfig.subtitleSize} text-white/80 font-medium mb-1`}
                            >
                                {subtitle}
                            </Text>
                        )}
                        <Text
                            className={`${sizeConfig.titleSize} text-white font-bold leading-tight`}
                        >
                            {title}
                        </Text>
                    </View>

                    {/* Image or Icon */}
                    {image && (
                        <View
                            className={`${sizeConfig.imageSize} rounded-lg overflow-hidden bg-white/10`}
                        >
                            <Image
                                source={image}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                    )}
                    {icon && !image && (
                        <View
                            className={`${sizeConfig.imageSize} items-center justify-center bg-white/10 rounded-lg`}
                        >
                            {icon}
                        </View>
                    )}
                </View>

                {/* Description */}
                {description && (
                    <Text
                        className={`${sizeConfig.descriptionSize} text-white/90 leading-relaxed mb-6`}
                    >
                        {description}
                    </Text>
                )}
            </View>

            {/* Action Button */}
            {hasButton && (
                <TouchableOpacity
                    onPress={onButtonPress || onPress}
                    disabled={disabled}
                    activeOpacity={0.8}
                    className={`
            bg-white/20 border border-white/30 
            ${borderRadiusClass} ${sizeConfig.buttonPadding} 
            items-center justify-center self-start
            ${disabled ? "opacity-50" : "active:bg-white/30"}
          `}
                >
                    <Text
                        className={`${sizeConfig.buttonTextSize} text-white font-semibold`}
                    >
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
        if (onPress && !hasButton) {
            return (
                <TouchableOpacity
                    onPress={onPress}
                    disabled={disabled}
                    activeOpacity={0.9}
                    style={style}
                    className={`
            ${borderRadiusClass} ${shadowClass} ${opacityClass} 
            overflow-hidden ${variantStyles.fallbackBg}
          `}
                >
                    {children}
                </TouchableOpacity>
            );
        }

        return (
            <View
                style={style}
                className={`
          ${borderRadiusClass} ${shadowClass} ${opacityClass} 
          overflow-hidden ${variantStyles.fallbackBg}
        `}
            >
                {children}
            </View>
        );
    };

    return (
        <CardWrapper>
            <CardContent />
        </CardWrapper>
    );
};

// Example usage component with sample data
const PromoteCardExamples: React.FC = () => {
    const handlePress = () => {
        console.log("Card pressed!");
    };

    const handleButtonPress = () => {
        console.log("Button pressed!");
    };

    // Simple icon component using text emoji
    const StarIcon = () => (
        <Text className="text-3xl">
            <Ionicons name="star" size={30} color={"yellow"} />
        </Text>
    );

    const HeartIcon = () => (
        <Text className="text-3xl">
            <Ionicons name="fitness" size={30} color={"red"} />
        </Text>
    );

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <View className="flex gap-4">
                {/* Primary Variant */}
                <PromoteCard
                    title="Upgrade to Premium"
                    subtitle="Limited Time Offer"
                    description="Unlock all premium features and get unlimited access to our entire library. Special pricing ends soon!"
                    buttonText="Upgrade Now"
                    onButtonPress={handleButtonPress}
                    variant="primary"
                    size="small"
                    icon={<StarIcon />}
                />

                {/* Success Variant - Small Size */}
                <PromoteCard
                    title="Track Your Progress"
                    description="Monitor your daily activities and achieve your health goals faster."
                    buttonText="Start Tracking"
                    onButtonPress={handleButtonPress}
                    variant="success"
                    size="small"
                    icon={<HeartIcon />}
                />

                {/* Purple Variant */}
                <PromoteCard
                    title="New Features"
                    description="Discover the latest updates and improvements."
                    buttonText="Explore"
                    onButtonPress={handleButtonPress}
                    variant="purple"
                    size="small"
                    borderRadius="2xl"
                />
            </View>
        </View>
    );
};

export default PromoteCard;
export { PromoteCardExamples };
