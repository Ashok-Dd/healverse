
import {
    ActivityLevel,
    DailySummary,
    DietaryRestriction,
    Goal,
    HealthCondition,
    HealthData, Meal,
    OptionsCardProps, User
} from "@/types/type";

export const BOY_OPTIONS : {label: string, image: any, value: ActivityLevel, icon: string}[] = [
    {
        label: "Sedentary",
        image: require("@/assets/images/boy-sendentery.png"),
        value: "SEDENTARY",
        icon: "🪑"
    },
    {
        label: "Lightly active",
        image: require("@/assets/images/boy-lightly-active.png"),
        value: 'LIGHTLY_ACTIVE',
        icon: "🚶"
    },
    {
        label: "Moderately active",
        image: require("@/assets/images/boy-moderate-active.png"),
        value: "MODERATELY_ACTIVE",
        icon: "🏃"
    },
    {
        label: "Very active",
        image: require("@/assets/images/boy-moderate-active.png"),
        value: "VERY_ACTIVE",
        icon: "🔥"
    },
];

export const GIRL_OPTIONS : {label: string, image: any, value: ActivityLevel, icon: string}[] = [
    {
        label: "Sedentary",
        image: require("@/assets/images/girl-sedentery.png"),
        value: "SEDENTARY",
        icon: "🪑"
    },
    {
        label: "Lightly active",
        image: require("@/assets/images/girl-lightly-active.png"),
        value: "LIGHTLY_ACTIVE",
        icon: "🚶"
    },
    {
        label: "Moderately active",
        image: require("@/assets/images/girl-moderatly-active.png"),
        value: "MODERATELY_ACTIVE",
        icon: "🏃"
    },
    {
        label: "Very active",
        image: require("@/assets/images/girl-very-active.png"),
        value: "VERY_ACTIVE",
        icon: "🔥"
    },
];

export const DIET_BOY_OPTIONS : {label: string, image: any, value: Goal, icon: string}[] = [
    {
        label: "Weight loss",
        image: require("@/assets/images/weightLoss-boy.png"),
        value: "WEIGHT_LOSS",
        icon: "⚖️"
    },
    {
        label: "Muscle Gain",
        image: require("@/assets/images/ImprovedHealth-boy.png"),
        value: "MUSCLE_GAIN",
        icon: "🌿"
    },
    {
        label: "Weight gain",
        image: require("@/assets/images/weightGain-boy.png"),
        value: "WEIGHT_GAIN",
        icon: "💪"
    },
    {
        label: "Maintain health",
        image: require("@/assets/images/MentalHealth-boy.png"),
        value: "MAINTAIN_WEIGHT",
        icon: "🧠"
    }
];

export const DIET_GIRL_OPTIONS : {label: string, image: any, value: Goal, icon: string}[] = [
    {
        label: "Weight loss",
        image: require("@/assets/images/weightLoss-girl.png"),
        value: "WEIGHT_LOSS",
        icon: "⚖️"
    },
    {
        label: "Maintan health",
        image: require("@/assets/images/ImprovedHealth-girl.png"),
        value: "MAINTAIN_WEIGHT",
        icon: "🌿"
    },
    {
        label: "Weight gain",
        image: require("@/assets/images/weightGain.png"),
        value: "WEIGHT_GAIN",
        icon: "💪"
    },
    {
        label: "Muscle gain",
        image: require("@/assets/images/MentalHealth-Girl.png"),
        value: "MUSCLE_GAIN",
        icon: "🧠"
    }
];

export const THANKS_BOY_OPTIONS = [
    {
        label: "Thanks, I'm all set",
        image: require("@/assets/images/Thanks-boy.png"),
        value: "all_set",
        icon: ""
    },
    {
        label: "Add more details",
        image: require("@/assets/images/AddDetails-boy.png"),
        value: "add_details",
        icon: ""
    }
];

export const THANKS_GIRL_OPTIONS = [
    {
        label: "Thanks, I'm all set",
        image: require("@/assets/images/Thanks-girl.png"),
        value: "all_set",
        icon: ""
    },
    {
        label: "Add more details",
        image: require("@/assets/images/AddDetails-girl.png"),
        value: "add_details",
        icon: ""
    }
];


export const dietaryLimitations: OptionsCardProps<DietaryRestriction>[] = [{
    id : 1 ,
    name : "None" ,
    icon : '🚫' ,
    info : null,
    value : "NONE"
} , {
    id : 2 ,
    name : "Vegiterian" ,
    icon : '🥦' ,
    info : '/info/vegiterian',
    value : "VEGETARIAN"
} , {
    id : 3 ,
    name : "Vegan" ,
    icon : '🌱' ,
    info : '/info/vegan',
    value : "VEGAN"
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
        id: 11,
        name: "High Blood Pressure",
        info: "/info/high-blood-pressure",
        icon: "🎗️",
        value:"HIGH_BLOOD_PRESSURE",
    },
    {
        id: 12,
        name: "High Cholesterol",
        info: "/info/high-cholesterol",
        icon: "🍳",
        value: "HIGH_CHOLESTEROL",
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
    caloriesProgress: 0,
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


enum MealType {
    BREAKFAST = 'BREAKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
    SNACK = 'SNACK'
}


interface DietPlan {
    id: number;
    user?: User;
    planDate: string; // ISO date format, e.g. '2025-07-30'
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    isGenerated: boolean;
    createdAt: string; // ISO datetime format, e.g. '2025-07-30T12:34:56'
    meals: Meal[];
}



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
                mealType: MealType.BREAKFAST,
                mealName: "Oatmeal with Fruits",
                calories: 350,
                protein: 15,
                carbs: 60,
                fat: 10,
                preparationTimeMinutes: 10,
                instructions: "Boil oats, mix with fruits and serve.",
                healthBenefits: "Good source of fiber and vitamins.",
                createdAt: "2025-07-30T07:00:00Z",
                ingredients: ["Oats", "Banana", "Berries", "Milk"]
            },
            {
                id: 2,
                mealType: MealType.LUNCH,
                mealName: "Grilled Chicken Salad",
                calories: 500,
                protein: 40,
                carbs: 20,
                fat: 25,
                preparationTimeMinutes: 20,
                instructions: "Grill chicken, chop vegetables, and mix with dressing.",
                healthBenefits: "High in protein and healthy fats.",
                createdAt: "2025-07-30T12:00:00Z",
                ingredients: ["Chicken Breast", "Lettuce", "Olive Oil", "Tomatoes", "Cucumber"]
            },
            {
                id: 3,
                mealType: MealType.DINNER,
                mealName: "Quinoa with Veggies",
                calories: 450,
                protein: 20,
                carbs: 50,
                fat: 15,
                preparationTimeMinutes: 25,
                instructions: "Cook quinoa, sauté vegetables, mix and serve.",
                healthBenefits: "Rich in protein, fiber, and antioxidants.",
                createdAt: "2025-07-30T19:00:00Z",
                ingredients: ["Quinoa", "Bell Peppers", "Zucchini", "Spinach", "Olive Oil"]
            }
        ] as Meal[]
});