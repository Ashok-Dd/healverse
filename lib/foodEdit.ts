import type { FoodItem, MealType } from "@/types/type";

/** Units offered when editing a food item. The AI may return others; the item's own unit stays selectable too. */
export const FOOD_UNITS = ["g", "ml", "piece", "cup", "tbsp", "tsp", "slice", "serving", "oz"] as const;

export const MEAL_TYPE_OPTIONS: { label: string; value: MealType }[] = [
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
  { label: "Snack", value: "SNACK" },
];

// Limits the server enforces (UpdateFoodLogRequest).
export const MAX_ITEMS = 30;
export const MAX_MEAL_NAME_LENGTH = 100;
const MAX_NAME_LENGTH = 100;
const MAX_QUANTITY = 100_000;
const MAX_CALORIES = 20_000;
const MAX_MACRO = 5_000;

type Macro = "calories" | "protein" | "fat" | "carbs";

/** An item while it is being edited: every number is the text in its field. */
export interface ItemDraft {
  key: string;
  name: string;
  quantity: string;
  unit: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  /** What the macros are scaled from when the quantity changes. Reset when a macro is typed by hand. */
  base: { quantity: number; calories: number; protein: number; fat: number; carbs: number };
}

export interface FoodItemPayload {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface UpdateFoodLogPayload {
  mealType: MealType;
  mealName?: string;
  items: FoodItemPayload[];
}

const round1 = (value: number) => Math.round(value * 10) / 10;
const text = (value: number) => String(round1(value));
const toNumber = (value: string) => Number(value.trim().replace(",", "."));

export function draftFromItem(item: FoodItem, key: string): ItemDraft {
  return {
    key,
    name: item.name,
    quantity: text(item.quantity),
    unit: item.unit,
    calories: text(item.calories),
    protein: text(item.protein),
    fat: text(item.fat),
    carbs: text(item.carbs),
    base: {
      quantity: item.quantity,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
    },
  };
}

export const emptyDraft = (key: string): ItemDraft => ({
  key,
  name: "",
  quantity: "1",
  unit: "serving",
  calories: "0",
  protein: "0",
  fat: "0",
  carbs: "0",
  base: { quantity: 1, calories: 0, protein: 0, fat: 0, carbs: 0 },
});

/** Changing the amount rescales calories and macros in proportion, from the last hand-typed values. */
export function withQuantity(draft: ItemDraft, quantity: string): ItemDraft {
  const amount = toNumber(quantity);
  if (!(amount > 0) || !(draft.base.quantity > 0)) return { ...draft, quantity };
  const scale = amount / draft.base.quantity;
  return {
    ...draft,
    quantity,
    calories: String(Math.round(draft.base.calories * scale)),
    protein: text(draft.base.protein * scale),
    fat: text(draft.base.fat * scale),
    carbs: text(draft.base.carbs * scale),
  };
}

/** A hand-typed calorie or macro value is kept as typed and becomes the base for later amount changes. */
export function withMacro(draft: ItemDraft, field: Macro, value: string): ItemDraft {
  const next = { ...draft, [field]: value };
  const quantity = toNumber(next.quantity);
  const numbers = {
    calories: toNumber(next.calories),
    protein: toNumber(next.protein),
    fat: toNumber(next.fat),
    carbs: toNumber(next.carbs),
  };
  if (!(quantity > 0) || Object.values(numbers).some(Number.isNaN)) return next;
  return { ...next, base: { quantity, ...numbers } };
}

const inRange = (value: number, max: number) => !Number.isNaN(value) && value >= 0 && value <= max;

/** The first problem the user must fix before saving, or null. */
export function validateDrafts(drafts: ItemDraft[]): string | null {
  if (drafts.length === 0) return "A meal needs at least one item.";
  if (drafts.length > MAX_ITEMS) return `A meal can have at most ${MAX_ITEMS} items.`;
  for (const draft of drafts) {
    const name = draft.name.trim();
    if (!name) return "Every item needs a name.";
    if (name.length > MAX_NAME_LENGTH) return `${name}: the name is too long.`;
    const quantity = toNumber(draft.quantity);
    if (!(quantity > 0) || quantity > MAX_QUANTITY) return `${name}: enter an amount above 0.`;
    if (!inRange(toNumber(draft.calories), MAX_CALORIES)) {
      return `${name}: calories must be between 0 and ${MAX_CALORIES}.`;
    }
    const macros = [draft.protein, draft.fat, draft.carbs].map(toNumber);
    if (!macros.every((macro) => inRange(macro, MAX_MACRO))) {
      return `${name}: protein, fat and carbs must be between 0 and ${MAX_MACRO} g.`;
    }
  }
  return null;
}

export function toPayload(mealType: MealType, mealName: string, drafts: ItemDraft[]): UpdateFoodLogPayload {
  return {
    mealType,
    mealName: mealName.trim() || undefined,
    items: drafts.map((draft) => ({
      name: draft.name.trim(),
      quantity: toNumber(draft.quantity),
      unit: draft.unit,
      calories: toNumber(draft.calories),
      protein: toNumber(draft.protein),
      fat: toNumber(draft.fat),
      carbs: toNumber(draft.carbs),
    })),
  };
}
