import male from "@/assets/images/boy.png";
import onboarding4 from "@/assets/images/daily-active-basis.png";
import emptyState from "@/assets/images/empty-state.png";
import onboarding1 from "@/assets/images/gender.png";
import female from "@/assets/images/girl.png";
import logo from "@/assets/images/logo.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import onboarding5 from "@/assets/images/onboarding5.png";
import onboarding6 from "@/assets/images/onboarding8.png";
import wave from "@/assets/images/wave.png";
import { ImageSourcePropType } from "react-native";





export const images : Record<string , ImageSourcePropType> = {
    onboarding1,
    onboarding2,
    onboarding3,
    onboarding4,
    onboarding5,
    onboarding6,
    onboarding11: logo,

    male,
    female,
    logo,
    emptyState,
    wave
};


export const INFO_ABOUT_CALORIE_CALCUATION = `The calorie calculator estimates your daily caloric needs based on factors such as
age, gender, weight, height, and activity level. It uses established formulas like the
Harris-Benedict equation to determine your Basal Metabolic Rate (BMR) and then adjusts
for your activity level to provide a personalized calorie target. This helps you understand
how many calories you need to maintain, lose, or gain weight effectively.`; 


// about the diet plan and give information that he can also replace it 
export const INFO_ABOUT_DIET_PLAN = `Your diet plan is tailored to your health goals, dietary preferences, and nutritional needs. It provides a balanced approach to eating, ensuring you get the right mix of macronutrients
(carbohydrates, proteins, and fats) and micronutrients (vitamins and minerals). You can customize
your plan by selecting preferred foods, adjusting portion sizes, and setting meal frequencies.
Remember, consistency is key to achieving your health objectives!`;