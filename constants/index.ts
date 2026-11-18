import male from "@/assets/images/boy.png";
import dietPlanNonePast from "@/assets/images/diet-plan-none-past.png";
import dietPlanStart from "@/assets/images/diet-plan-start.png";
import dietPlanUnavailable from "@/assets/images/diet-plan-unavailable.png";
import emptyState from "@/assets/images/empty-state.png";
import female from "@/assets/images/girl.png";
import logo from "@/assets/images/logo.png";
import wave from "@/assets/images/wave.png";
import welcomeHero from "@/assets/images/welcome-hero.png";
import { ImageSourcePropType } from "react-native";





export const images : Record<string , ImageSourcePropType> = {

    male,
    female,
    logo,
    emptyState,
    dietPlanStart,
    dietPlanNonePast,
    dietPlanUnavailable,
    wave,
    welcomeHero,
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