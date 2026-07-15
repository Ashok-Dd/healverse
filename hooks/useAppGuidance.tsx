import { Ionicons } from '@expo/vector-icons';
import { create } from 'zustand';

interface GuidanceModalState {
  visible: boolean;
  title: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'info' | 'tip' | 'warning' | 'feature';
}

interface GuidanceModalStore extends GuidanceModalState {
  // Actions
  showGuidance: (config: {
    title?: string;
    content: string;
    icon?: keyof typeof Ionicons.glyphMap;
    type?: 'info' | 'tip' | 'warning' | 'feature';
  }) => void;
  hideGuidance: () => void;
  
  // Predefined guidance methods for common scenarios
  showFeatureTip: (title: string, content: string) => void;
  showAppHelp: (content: string) => void;
  showWarning: (title: string, content: string) => void;
  showOnboarding: (title: string, content: string) => void;
}

export const useGuidanceModal = create<GuidanceModalStore>((set) => ({
  // Initial state
  visible: false,
  title: '',
  content: '',
  icon: 'information-circle',
  type: 'info',

  // Actions
  showGuidance: (config) => {
    set({
      visible: true,
      title: config.title || 'App Guidance',
      content: config.content,
      icon: config.icon || 'information-circle',
      type: config.type || 'info',
    });
  },

  hideGuidance: () => {
    set({ visible: false });
  },

  // Predefined methods for common use cases
  showFeatureTip: (title, content) => {
    set({
      visible: true,
      title,
      content,
      icon: 'bulb',
      type: 'tip',
    });
  },

  showAppHelp: (content) => {
    set({
      visible: true,
      title: 'App Help',
      content,
      icon: 'help-circle',
      type: 'info',
    });
  },

  showWarning: (title, content) => {
    set({
      visible: true,
      title,
      content,
      icon: 'warning',
      type: 'warning',
    });
  },

  showOnboarding: (title, content) => {
    set({
      visible: true,
      title,
      content,
      icon: 'rocket',
      type: 'feature',
    });
  },
}));

// Hook for easy access to guidance functions
export const useAppGuidance = () => {
  const { showGuidance, showFeatureTip, showAppHelp, showWarning, showOnboarding } = useGuidanceModal();
  
  return {
    showGuidance,
    showFeatureTip,
    showAppHelp,
    showWarning,
    showOnboarding,
  };
};
