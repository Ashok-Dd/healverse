import { usePathname } from "expo-router";

const useCurrentStep = () => {
  const pathname = usePathname();

  const match = pathname.match(/step(\d+)/);

  const currentStep = match ? parseInt(match[1]) : 1;


  return {
    currentStep,
    totalSteps : 11,
  };
};

export default useCurrentStep;
