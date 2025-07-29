// Place this in your screen/component file


import {ActivityLevel, DietaryRestriction, Goal, HealthCondition, OptionsCardProps} from "@/types/type";

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
