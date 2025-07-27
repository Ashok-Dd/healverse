import { usePathname } from "expo-router";

const useCurrentStep = () => {
  const pathname = usePathname();

  const match = pathname.match(/step(\d+)/);

  const currentStep = match ? parseInt(match[1]) : 1;

  const totalSteps = 3;

  return {
    currentStep,
    totalSteps,
  };
};

export default useCurrentStep;
