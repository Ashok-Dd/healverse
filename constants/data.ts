import {
  ActivityLevel,
  DailySummary,
  DietaryRestriction,
  DietPlan,
  Goal,
  HealthCondition,
  HealthData,
  HealthQuery,
  Meal,
  OptionsCardProps,
  Question,
  User,
} from "@/types/type";

export const questions: Question[] = [
  {
    id: "checkupType",
    botMessage:
      "Hi there! 🩺 I'm Dr. Alex, your AI health assistant. What type of medical checkup would you like to schedule today?",
    type: "options",
    options: [
      "🩸 Annual Blood Test",
      "🦷 Dental Cleaning",
      "👁️ Eye Examination",
      "❤️ Cardiology Checkup",
      "🏥 General Health Checkup",
      "🧠 Neurological Exam",
      "🩻 X-Ray/Imaging",
      "💉 Vaccination",
      "🔬 Laboratory Tests",
    ],
  },
  {
    id: "selectedDate",
    botMessage:
      "Excellent choice! 📅 When would you like to schedule this appointment? Please select your preferred date.",
    type: "calendar",
  },
  {
    id: "selectedTime",
    botMessage:
      "Perfect! ⏰ What time works best for your schedule? Choose from our available time slots.",
    type: "time",
  },
  {
    id: "reminderTime",
    botMessage:
      "Great! 🔔 When would you like to receive a reminder about your appointment?",
    type: "options",
    options: [
      "🔔 30 minutes before",
      "⏰ 1 hour before",
      "🕐 2 hours before",
      "📅 1 day before",
      "📆 2 days before",
      "🗓️ 1 week before",
    ],
  },
  {
    id: "notes",
    botMessage:
      "Almost done! 📝 Do you have any special notes, symptoms to discuss, or preparations needed for this appointment?",
    type: "textarea",
    placeholder:
      "e.g., Fasting required, bring insurance card, discuss symptoms, medication allergies...",
  },
];

export const TIME_OPTIONS: { [label: string]: string } = {
  "6:00 AM": "06:00",
  "7:00 AM": "07:00",
  "8:00 AM": "08:00",
  "9:00 AM": "09:00",
  "10:00 AM": "10:00",
  "11:00 AM": "11:00",
  "12:00 PM": "12:00",
  "1:00 PM": "13:00",
  "2:00 PM": "14:00",
  "3:00 PM": "15:00",
  "4:00 PM": "16:00",
  "5:00 PM": "17:00",
  "6:00 PM": "18:00",
  "7:00 PM": "19:00",
  "8:00 PM": "20:00",
  "9:00 PM": "21:00",
  "10:00 PM": "22:00",
  "11:00 PM": "23:00",
};

export const BOY_OPTIONS: {
  label: string;
  image: any;
  value: ActivityLevel;
  icon: string;
}[] = [
  {
    label: "Sedentary",
    image: require("@/assets/images/boy-sendentery.png"),
    value: "SEDENTARY",
    icon: "🪑",
  },
  {
    label: "Lightly active",
    image: require("@/assets/images/boy-lightly-active.png"),
    value: "LIGHTLY_ACTIVE",
    icon: "🚶",
  },
  {
    label: "Moderately active",
    image: require("@/assets/images/boy-moderate-active.png"),
    value: "MODERATELY_ACTIVE",
    icon: "🏃",
  },
  {
    label: "Very active",
    image: require("@/assets/images/boy-moderate-active.png"),
    value: "VERY_ACTIVE",
    icon: "🔥",
  },
  {
    label: "Extremely Active",
    image: require("@/assets/images/boy-moderate-active.png"),
    value: "EXTREMELY_ACTIVE",
    icon: "🔥",
  },
];

export const GIRL_OPTIONS: {
  label: string;
  image: any;
  value: ActivityLevel;
  icon: string;
}[] = [
  {
    label: "Sedentary",
    image: require("@/assets/images/girl-sedentery.png"),
    value: "SEDENTARY",
    icon: "🪑",
  },
  {
    label: "Lightly active",
    image: require("@/assets/images/girl-lightly-active.png"),
    value: "LIGHTLY_ACTIVE",
    icon: "🚶",
  },
  {
    label: "Moderately active",
    image: require("@/assets/images/girl-moderatly-active.png"),
    value: "MODERATELY_ACTIVE",
    icon: "🏃",
  },
  {
    label: "Very active",
    image: require("@/assets/images/girl-very-active.png"),
    value: "VERY_ACTIVE",
    icon: "🔥",
  },
  {
    label: "Extremely Active",
    image: require("@/assets/images/girl-very-active.png"),
    value: "EXTREMELY_ACTIVE",
    icon: "🔥",
  },
];

export const DIET_BOY_OPTIONS: {
  label: string;
  image: any;
  value: Goal;
  icon: string;
}[] = [
  {
    label: "Lose weight",
    image: require("@/assets/images/weightLoss-boy.png"),
    value: "LOSE_WEIGHT",
    icon: "⚖️",
  },
  {
    label: "Build muscle",
    image: require("@/assets/images/ImprovedHealth-boy.png"), // Consider renaming if needed
    value: "BUILD_MUSCLE",
    icon: "💪",
  },
  {
    label: "Gain weight",
    image: require("@/assets/images/weightGain-boy.png"),
    value: "GAIN_WEIGHT",
    icon: "🍽️",
  },
  {
    label: "Maintain weight",
    image: require("@/assets/images/MentalHealth-boy.png"), // Consider renaming if needed
    value: "MAINTAIN_WEIGHT",
    icon: "🌿",
  },
];

export const DIET_GIRL_OPTIONS: {
  label: string;
  image: any;
  value: Goal;
  icon: string;
}[] = [
  {
    label: "Lose weight",
    image: require("@/assets/images/weightLoss-girl.png"),
    value: "LOSE_WEIGHT",
    icon: "⚖️",
  },
  {
    label: "Maintain weight",
    image: require("@/assets/images/ImprovedHealth-girl.png"),
    value: "MAINTAIN_WEIGHT",
    icon: "🌿",
  },
  {
    label: "Gain weight",
    image: require("@/assets/images/weightGain.png"),
    value: "GAIN_WEIGHT",
    icon: "🍽️",
  },
  {
    label: "Build muscle",
    image: require("@/assets/images/ImprovedHealth-girl.png"), // Suggest replacing image name
    value: "BUILD_MUSCLE",
    icon: "💪",
  },
  {
    label: "Improve fitness",
    image: require("@/assets/images/weightGain.png"), // Suggest replacing image name
    value: "IMPROVE_FITNESS",
    icon: "🏃‍♀️",
  },
];

export const THANKS_BOY_OPTIONS = [
  {
    label: "Thanks, I'm all set",
    image: require("@/assets/images/Thanks-boy.png"),
    value: "all_set",
    icon: "",
  },
];

export const THANKS_GIRL_OPTIONS = [
  {
    label: "Thanks, I'm all set",
    image: require("@/assets/images/Thanks-girl.png"),
    value: "all_set",
    icon: "",
  },
];

export const dietaryLimitations: OptionsCardProps<DietaryRestriction>[] = [
  {
    id: 1,
    name: "Vegetarian",
    icon: "🥦",
    info: "/info/vegetarian",
    value: "VEGETARIAN",
  },
  {
    id: 2,
    name: "Vegan",
    icon: "🌱",
    info: "/info/vegan",
    value: "VEGAN",
  },
  {
    id: 3,
    name: "Non-Vegetarian",
    icon: "🍗",
    info: "/info/non-vegetarian",
    value: "NON_VEGETARIAN",
  },
  {
    id: 4,
    name: "Pescatarian",
    icon: "🐟",
    info: "/info/pescatarian",
    value: "PESCATARIAN",
  },
  {
    id: 5,
    name: "Ketogenic",
    icon: "🥩",
    info: "/info/keto",
    value: "KETO",
  },
  {
    id: 6,
    name: "Paleo",
    icon: "🍖",
    info: "/info/paleo",
    value: "PALEO",
  },
  {
    id: 7,
    name: "Mediterranean",
    icon: "🍅",
    info: "/info/mediterranean",
    value: "MEDITERRANEAN",
  },
  {
    id: 8,
    name: "Gluten-Free",
    icon: "🚫🌾",
    info: "/info/gluten-free",
    value: "GLUTEN_FREE",
  },
  {
    id: 9,
    name: "Dairy-Free",
    icon: "🥛❌",
    info: "/info/dairy-free",
    value: "DAIRY_FREE",
  },
  {
    id: 10,
    name: "Low Carb",
    icon: "⬇️🍞",
    info: "/info/low-carb",
    value: "LOW_CARB",
  },
  {
    id: 11,
    name: "Low Fat",
    icon: "⬇️🥓",
    info: "/info/low-fat",
    value: "LOW_FAT",
  },
];

export const healthConditions: OptionsCardProps<HealthCondition>[] = [
  {
    id: 1,
    name: "None",
    info: null,
    icon: "✅",
    value: "NONE",
  },
  {
    id: 2,
    name: "Diabetes",
    info: "Affects blood sugar levels",
    icon: "🩸",
    value: "DIABETES",
  },
  {
    id: 3,
    name: "High Blood Pressure",
    info: "/info/high-blood-pressure",
    icon: "🎗️",
    value: "HYPERTENSION",
  },
  {
    id: 4,
    name: "Heart Disease",
    info: "/info/heart-disease",
    icon: "❤️",
    value: "HEART_DISEASE",
  },
  {
    id: 5,
    name: "Thyroid Issues",
    info: "/info/thyroid",
    icon: "🧠",
    value: "THYROID",
  },
  {
    id: 6,
    name: "PCOS",
    info: "/info/pcos",
    icon: "👩‍⚕️",
    value: "PCOS",
  },
  {
    id: 7,
    name: "Arthritis",
    info: "/info/arthritis",
    icon: "🦴",
    value: "ARTHRITIS",
  },
  {
    id: 8,
    name: "Digestive Issues",
    info: "/info/digestive-issues",
    icon: "🍽️",
    value: "DIGESTIVE_ISSUES",
  },
  {
    id: 9,
    name: "Food Allergies",
    info: "/info/allergies",
    icon: "🌰",
    value: "ALLERGIES",
  },
  {
    id: 10,
    name: "Other",
    info: "/info/other-health",
    icon: "❓",
    value: "OTHER",
  },
];

export const createDefaultSummary = (date: string): DailySummary => ({
  date,
  targetCalories: 0,
  consumedCalories: 0,
  caloriesBurned: 0,
  remainingCalories: 0,
  targetProtein: 0,
  consumedProtein: 0,
  targetCarbs: 0,
  consumedCarbs: 0,
  targetFat: 0,
  consumedFat: 0,
  waterConsumedMl: 0,
  targetWaterMl: 0,
  calorieProgress: 0,
  proteinProgress: 0,
  carbsProgress: 0,
  fatProgress: 0,
  waterProgress: 0,
});

export const createDefaultHealthData = (date: string): HealthData => ({
  summary: createDefaultSummary(date),
  foodLogs: [],
  exerciseLogs: [],
  waterLogs: [],
});

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDummyDietPlan = (): DietPlan => ({
  id: 1,
  planDate: "2025-07-30",
  totalCalories: 2000,
  totalProtein: 120,
  totalCarbs: 250,
  totalFat: 70,
  isGenerated: true,
  createdAt: "2025-07-30T09:00:00Z",
  meals: [
    {
      id: 1,
      mealType: "BREAKFAST",
      mealName: "Oatmeal with Fruits",
      calories: 350,
      protein: 15,
      carbs: 60,
      fat: 10,
      preparationTimeMinutes: 10,
      instructions: "Boil oats, mix with fruits and serve.",
      healthBenefits: "Good source of fiber and vitamins.",
      createdAt: "2025-07-30T07:00:00Z",
      ingredients: ["Oats", "Banana", "Berries", "Milk"],
    },
    {
      id: 2,
      mealType: "LUNCH",
      mealName: "Grilled Chicken Salad",
      calories: 500,
      protein: 40,
      carbs: 20,
      fat: 25,
      preparationTimeMinutes: 20,
      instructions: "Grill chicken, chop vegetables, and mix with dressing.",
      healthBenefits: "High in protein and healthy fats.",
      createdAt: "2025-07-30T12:00:00Z",
      ingredients: [
        "Chicken Breast",
        "Lettuce",
        "Olive Oil",
        "Tomatoes",
        "Cucumber",
      ],
    },
    {
      id: 3,
      mealType: "DINNER",
      mealName: "Quinoa with Veggies",
      calories: 450,
      protein: 20,
      carbs: 50,
      fat: 15,
      preparationTimeMinutes: 25,
      instructions: "Cook quinoa, sauté vegetables, mix and serve.",
      healthBenefits: "Rich in protein, fiber, and antioxidants.",
      createdAt: "2025-07-30T19:00:00Z",
      ingredients: [
        "Quinoa",
        "Bell Peppers",
        "Zucchini",
        "Spinach",
        "Olive Oil",
      ],
    },
  ] as Meal[],
});

export const healthQueries: HealthQuery[] = [
  {
    id: "1",
    icon: "airplane",
    title: "Mental Health Check",
    description:
      "How can I improve my mental wellbeing and manage stress effectively?",
    category: "Mental Health",
    color: "#3B82F6",
  },
  {
    id: "2",
    icon: "heart-outline",
    title: "Heart Health",
    description: "What are the signs of a healthy cardiovascular system?",
    category: "Cardiology",
    color: "#EF4444",
  },
  {
    id: "3",
    icon: "fitness-outline",
    title: "Exercise & Fitness",
    description: "What's the best workout routine for my fitness goals?",
    category: "Fitness",
    color: "#10B981",
  },
  {
    id: "4",
    icon: "restaurant-outline",
    title: "Meal Planning",
    description: "How do I plan balanced meals that fit my diet goals?",
    category: "Nutrition",
    color: "#8B5CF6",
  },
  {
    id: "5",
    icon: "pulse-outline",
    title: "Symptom Checker",
    description: "What could these symptoms indicate about my health?",
    category: "Diagnosis",
    color: "#6366F1",
  },
  {
    id: "6",
    icon: "shield-checkmark-outline",
    title: "Preventive Care",
    description: "What screenings and checkups do I need for my age?",
    category: "Prevention",
    color: "#F59E0B",
  },
  {
    id: "7",
    icon: "moon-outline",
    title: "Sleep Health",
    description: "How can I improve my sleep quality and duration?",
    category: "Sleep",
    color: "#64748B",
  },
  {
    id: "8",
    icon: "nutrition-outline",
    title: "Nutrition Advice",
    description: "What diet plan would work best for my health goals?",
    category: "Nutrition",
    color: "#059669",
  },
];
