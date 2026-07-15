import AppGuidanceModal from '@/components/modals/AppGuidanceModal';
import { useGuidanceModal } from '@/hooks/useAppGuidance';
import React from 'react';

interface AppGuidanceProviderProps {
  children: React.ReactNode;
}

const AppGuidanceProvider: React.FC<AppGuidanceProviderProps> = ({ children }) => {
  const { visible, title, content, icon, type, hideGuidance } = useGuidanceModal();

  return (
    <>
      {children}
      <AppGuidanceModal
        visible={visible}
        title={title}
        content={content}
        icon={icon}
        type={type}
        onClose={hideGuidance}
      />
    </>
  );
};

export default AppGuidanceProvider;
