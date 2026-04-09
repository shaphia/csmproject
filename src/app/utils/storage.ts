import { CheckInEntry, RoutineProduct, ProductShelfItem, RoutineLog } from '../types';

const KEYS = {
  CHECK_INS: 'skincare_checkins',
  ROUTINE_PRODUCTS: 'skincare_routine_products',
  PRODUCT_SHELF: 'skincare_product_shelf',
  ROUTINE_LOGS: 'skincare_routine_logs',
  LAST_CHECK_IN: 'skincare_last_checkin',
} as const;

export const storage = {
  // Check-ins
  getCheckIns(): CheckInEntry[] {
    const data = localStorage.getItem(KEYS.CHECK_INS);
    return data ? JSON.parse(data) : [];
  },

  saveCheckIn(entry: CheckInEntry) {
    const checkIns = this.getCheckIns();
    const index = checkIns.findIndex(c => c.id === entry.id);
    if (index >= 0) {
      checkIns[index] = entry;
    } else {
      checkIns.push(entry);
    }
    localStorage.setItem(KEYS.CHECK_INS, JSON.stringify(checkIns));
    localStorage.setItem(KEYS.LAST_CHECK_IN, entry.date);
  },

  deleteCheckIn(id: string) {
    const checkIns = this.getCheckIns().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CHECK_INS, JSON.stringify(checkIns));
  },

  getLastCheckInDate(): string | null {
    return localStorage.getItem(KEYS.LAST_CHECK_IN);
  },

  // Routine Products
  getRoutineProducts(): RoutineProduct[] {
    const data = localStorage.getItem(KEYS.ROUTINE_PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveRoutineProduct(product: RoutineProduct) {
    const products = this.getRoutineProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(KEYS.ROUTINE_PRODUCTS, JSON.stringify(products));
  },

  deleteRoutineProduct(id: string) {
    const products = this.getRoutineProducts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.ROUTINE_PRODUCTS, JSON.stringify(products));
  },

  updateRoutineProducts(products: RoutineProduct[]) {
    localStorage.setItem(KEYS.ROUTINE_PRODUCTS, JSON.stringify(products));
  },

  // Product Shelf
  getProductShelf(): ProductShelfItem[] {
    const data = localStorage.getItem(KEYS.PRODUCT_SHELF);
    return data ? JSON.parse(data) : [];
  },

  saveProductShelfItem(item: ProductShelfItem) {
    const items = this.getProductShelf();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(KEYS.PRODUCT_SHELF, JSON.stringify(items));
  },

  deleteProductShelfItem(id: string) {
    const items = this.getProductShelf().filter(i => i.id !== id);
    localStorage.setItem(KEYS.PRODUCT_SHELF, JSON.stringify(items));
  },

  // Routine Logs
  getRoutineLogs(): RoutineLog[] {
    const data = localStorage.getItem(KEYS.ROUTINE_LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveRoutineLog(log: RoutineLog) {
    const logs = this.getRoutineLogs();
    const index = logs.findIndex(l => l.date === log.date && l.timeOfDay === log.timeOfDay);
    if (index >= 0) {
      logs[index] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem(KEYS.ROUTINE_LOGS, JSON.stringify(logs));
  },
};

export function calculateStreak(): number {
  const checkIns = storage.getCheckIns();
  if (checkIns.length === 0) return 0;

  const dates = checkIns
    .map(c => new Date(c.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const uniqueDates = Array.from(new Set(dates));
  const today = new Date().toDateString();

  if (uniqueDates[0] !== today && uniqueDates[0] !== new Date(Date.now() - 86400000).toDateString()) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const next = new Date(uniqueDates[i]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
