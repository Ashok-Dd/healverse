import {IntensityLevel} from "@/types/type";

export const EXERCISE_ICONS: { [key: string]: string } = {
    walking: "walk",
    running: "fitness",
    cycling: "bicycle",
    "weight training": "barbell",
    "weight lifting": "barbell",
    yoga: "body",
    swimming: "water",
    elliptical: "fitness",
    "bodyweight exercises": "body",
    rowing: "boat",
    "jumping rope": "fitness",
    dancing: "musical-notes",
    default: "fitness"
};

export const EXERCISE_DESCRIPTIONS: { [key: string]: string } = {
    rowing: "A full-body cardio and strength workout that primarily targets your arms, back, and legs.",
    running: "High-intensity cardiovascular exercise that burns calories efficiently and improves endurance.",
    walking: "Low-impact cardiovascular exercise perfect for beginners and daily fitness maintenance.",
    cycling: "Excellent lower body workout that builds leg strength while providing great cardio benefits.",
    swimming: "Full-body, low-impact exercise that works all major muscle groups simultaneously.",
    yoga: "Mind-body practice that improves flexibility, strength, and mental well-being.",
    "weight training": "Strength training that builds muscle mass and increases metabolic rate.",
    "weight lifting": "Strength training that builds muscle mass and increases metabolic rate.",
    dancing: "Fun cardiovascular workout that improves coordination and burns calories.",
    "jumping rope": "High-intensity cardio that improves coordination and burns calories quickly.",
    default: "Great exercise for overall fitness and health."
};

export const INTENSITY_LEVELS: IntensityLevel[] = [
    { level: "LOW", color: "#10b981", label: "Low" },
    { level: "MODERATE", color: "#3b82f6", label: "Moderate" },
    { level: "HIGH", color: "#f59e0b", label: "High" },
];

export const ITEM_HEIGHT = 50;
export const PICKER_HEIGHT = 200;
export const DURATION_OPTIONS = Array.from({ length: 60 }, (_, i) => (i + 1) * 5);