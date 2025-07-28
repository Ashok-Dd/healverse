import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ButtonProps } from '@/types/type';

const Button: React.FC<ButtonProps> = ({
                                           title,
                                           onPress,
                                           variant = 'primary',
                                           disabled = false,
                                           loading = false,
                                           className = '',
                                           textClassName = '',
                                           icon,
                                       }) => {
    const getButtonStyles = () => {
        const baseStyles = 'flex-row items-center justify-center rounded-full px-2 py-3';

        if (variant === 'primary') {
            return `${baseStyles} bg-primary-600 ${disabled ? 'opacity-50' : ''} ${className}`;
        }

        return `${baseStyles} border border-gray-300 ${disabled ? 'opacity-50' : ''} ${className}`;
    };

    const getTextStyles = () => {
        if (variant === 'primary') {
            return `text-white text-base font-semibold ${textClassName}`;
        }

        return `text-base font-semibold ${textClassName}`;
    };

    return (
        <TouchableOpacity
            className={getButtonStyles()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? '#ffffff' : '#374151'}
                />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text className={getTextStyles()}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;
