import React from 'react';
import { View, Text } from 'react-native';
import Button from './Button';
import { ActionButtonsProps } from '@/types/type';

const ActionButtons: React.FC<ActionButtonsProps> = ({
                                                         onSyncHealth,
                                                         onSignIn,
                                                         onContinue,
                                                         loading = false,
                                                     }) => {
    return (
        <View className="px-6 pb-6">
            {/* Health Sync Button */}
            {onSyncHealth && (
                <View className="mb-6">
                    <Button
                        title="💙 Sync with Google Health Connect"
                        onPress={onSyncHealth}
                        variant="secondary"
                        className="bg-blue-50 py-3 rounded-full"
                        textClassName="text-blue-600 font-jakarta-medium text-xs"
                    />
                </View>
            )}

            {/* Sign In Link */}
            {onSignIn && (
                <View className="mb-6">
                    <Button
                        title="If you have account, please sign in here"
                        onPress={onSignIn}
                        variant="secondary"
                        className="bg-blue-50 py-3 rounded-full"
                        textClassName="text-blue-500 font-jakarta-medium text-xs"
                    />
                </View>
            )}

            {/* Continue Button */}
            <Button
                title={loading ? "Loading..." : "Continue"}
                onPress={onContinue}
                variant="primary"
                loading={loading}
                className="bg-primary-500 py-3 rounded-2xl shadow-medium"
                textClassName="text-white font-jakarta-semi-bold text-lg"
            />
        </View>
    );
};

export default ActionButtons;