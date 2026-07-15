import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface AppGuidanceModalProps {
  visible: boolean;
  title?: string;
  content: string;
  onClose: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'info' | 'tip' | 'warning' | 'feature';
}

const AppGuidanceModal: React.FC<AppGuidanceModalProps> = ({
  visible,
  title = "App Guidance",
  content,
  onClose,
  icon = "information-circle",
  type = "info"
}) => {
  // Get styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'tip':
        return {
          headerBg: 'bg-primary-600',
          iconColor: '#FFFFFF',
          accentColor: 'border-blue-500'
        };
      case 'warning':
        return {
          headerBg: 'bg-orange-500',
          iconColor: '#FFFFFF',
          accentColor: 'border-orange-500'
        };
      case 'feature':
        return {
          headerBg: 'bg-green-500',
          iconColor: '#FFFFFF',
          accentColor: 'border-green-500'
        };
      default: // info
        return {
          headerBg: 'bg-gray-700',
          iconColor: '#FFFFFF',
          accentColor: 'border-gray-500'
        };
    }
  };

  const styles = getTypeStyles();

  const formatContent = (text: string) => {
    // Split content by double line breaks for paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a bullet point
      if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
        const bulletPoints = paragraph.split('\n').filter(p => p.trim());
        return (
          <View key={index} className="mb-3">
            {bulletPoints.map((point, pointIndex) => (
              <View key={pointIndex} className="flex-row items-start mb-2">
                <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2.5" />
                <Text className="text-gray-700 text-sm leading-relaxed flex-1">
                  {point.replace(/^[•-]\s*/, '')}
                </Text>
              </View>
            ))}
          </View>
        );
      }
      
      // Check if it's a heading (starts with #)
      if (paragraph.trim().startsWith('#')) {
        const headingText = paragraph.replace(/^#+\s*/, '');
        return (
          <Text key={index} className="text-lg font-bold text-gray-900 mb-2 mt-3">
            {headingText}
          </Text>
        );
      }
      
      // Regular paragraph
      return (
        <Text key={index} className="text-gray-700 text-sm leading-relaxed mb-3">
          {paragraph}
        </Text>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-8">
        <View className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <View className={`bg-primary-500 px-4 py-3.5 flex-row items-center justify-between`}>
            <View className="flex-row items-center flex-1">
              <Ionicons name={icon} size={22} color={styles.iconColor} />
              <Text className="text-white text-base font-semibold ml-2.5 flex-1">
                {title}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              className="p-1.5 -mr-1"
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} color={styles.iconColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            className="px-5 py-4 max-h-96 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {formatContent(content)}
          </ScrollView>

          {/* Footer */}
          <View className="px-5 py-3.5 bg-gray-50 border-t border-gray-100">
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary-500 py-2.5 px-4 rounded-lg flex-row items-center justify-center active:bg-primary-600"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-semibold">
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppGuidanceModal;