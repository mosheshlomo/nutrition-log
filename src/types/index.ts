export interface LogEntry {
  id: string;
  date: string;
  meal: string;
  foodName: string;
  quantity?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateItem {
  id: string;
  templateId: string;
  foodItemId?: string | null;
  foodName: string;
  quantity?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sortOrder: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  items: TemplateItem[];
}

export interface UserSettings {
  id: string;
  caloriesTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  mealOrder: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MacroKey = "calories" | "protein" | "carbs" | "fat";
