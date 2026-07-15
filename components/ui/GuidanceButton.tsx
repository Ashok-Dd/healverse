import { APP_GUIDANCE, getGuidanceContent } from '@/constants/appGuidance';
import { useAppGuidance } from '@/hooks/useAppGuidance';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface GuidanceButtonProps {
  guidanceKey?: keyof typeof APP_GUIDANCE;
  title?: string;
  content?: string;
  type?: 'info' | 'tip' | 'warning' | 'feature';
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'icon-only';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const GuidanceButton: React.FC<GuidanceButtonProps> = ({
  guidanceKey,
  title,
  content,
  type = 'info',
  buttonText = 'Help',
  variant = 'secondary',
  size = 'medium',
  className = ''
}) => {
  const { showGuidance } = useAppGuidance();

  const handlePress = () => {
    if (guidanceKey) {
      const guidanceContent = getGuidanceContent(guidanceKey);
      showGuidance({
        title: guidanceContent.title,
        content: guidanceContent.content,
        type: guidanceContent.type as any,
      });
    } else if (content) {
      showGuidance({
        title: title || 'App Guidance',
        content,
        type,
      });
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-0',
          text: 'text-xs',
          icon: 15
        };
      case 'large':
        return {
          container: 'px-6 py-3',
          text: 'text-base',
          icon: 20
        };
      default: // medium
        return {
          container: 'px-4 py-2',
          text: 'text-sm',
          icon: 16
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 border border-blue-500';
      case 'icon-only':
        return 'bg-gray-100  rounded-full flex-center';
      default: // secondary
        return 'bg-gray-100 border border-gray-300';
    }
  };

  const getTextColor = () => {
    return variant === 'primary' ? 'text-white' : 'text-gray-700';
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  if (variant === 'icon-only') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`${variantStyles} ${className} mx-2`}
        activeOpacity={0.7}
      >
        <Feather 
          name="help-circle" 
          size={sizeStyles.icon} 
          color="#6B7280"
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${variantStyles} ${sizeStyles.container} rounded-lg flex-row items-center justify-center ${className}`}
      activeOpacity={0.7}
    >
      <Feather 
        name="help-circle" 
        size={sizeStyles.icon} 
        color={variant === 'primary' ? '#FFFFFF' : '#6B7280'} 
        style={{ marginRight: 6 }}
      />
      <Text className={`${sizeStyles.text} ${textColor} font-medium`}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default GuidanceButton;
