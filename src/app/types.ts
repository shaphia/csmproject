export type SkinMood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';
export type SkinConcern = 'acne' | 'dry' | 'oily' | 'redness' | 'sensitive' | 'combination';
export type ProductType = 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'eye-cream' | 'mask';
export type TimeOfDay = 'AM' | 'PM';

export interface CheckInEntry {
  id: string;
  date: string;
  mood: SkinMood;
  concerns: SkinConcern[];
  waterIntake: number;
  rating: number;
  notes: string;
}

export interface RoutineProduct {
  id: string;
  name: string;
  type: ProductType;
  timeOfDay: TimeOfDay;
  order: number;
  completed?: boolean;
  expiryDate?: string;
}

export interface ProductShelfItem {
  id: string;
  name: string;
  brand: string;
  type: ProductType;
  openedDate: string;
  expiryDate: string;
  ingredients?: string[];
}

export interface RoutineLog {
  date: string;
  timeOfDay: TimeOfDay;
  productIds: string[];
}
