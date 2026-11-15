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
          headerBg: 'bg-primary',
          iconClass: 'text-primary-foreground',
          accentColor: 'border-border'
        };
      case 'warning':
        return {
          headerBg: 'bg-warning',
          iconClass: 'text-background',
          accentColor: 'border-warning/30'
        };
      case 'feature':
        return {
          headerBg: 'bg-primary',
          iconClass: 'text-primary-foreground',
          accentColor: 'border-border'
        };
      default: // info
        return {
          headerBg: 'bg-secondary-foreground',
          iconClass: 'text-background',
          accentColor: 'border-border'
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
                <View className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2.5" />
                <Text className="text-foreground text-sm leading-relaxed flex-1">
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
          <Text key={index} className="text-lg font-body-bold text-foreground mb-2 mt-3">
            {headingText}
          </Text>
        );
      }
      
      // Regular paragraph
      return (
        <Text key={index} className="text-foreground text-sm leading-relaxed mb-3">
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
        <View className="bg-card max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <View className={`bg-primary px-4 py-3.5 flex-row items-center justify-between`}>
            <View className="flex-row items-center flex-1">
              <Ionicons name={icon} size={22} className={styles.iconClass} />
              <Text className={`${styles.iconClass} text-base font-body-semibold ml-2.5 flex-1`}>
                {title}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              className="p-1.5 -mr-1"
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} className={styles.iconClass} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            className="px-5 py-4 max-h-96 bg-card"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {formatContent(content)}
          </ScrollView>

          {/* Footer */}
          <View className="px-5 py-3.5 bg-background border-t border-border">
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary py-2.5 px-4 rounded-lg flex-row items-center justify-center active:bg-primary"
              activeOpacity={0.8}
            >
              <Text className="text-primary-foreground text-sm font-body-semibold">
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