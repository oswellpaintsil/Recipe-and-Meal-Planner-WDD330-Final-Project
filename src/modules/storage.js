/**
 * Data Management Module.
 * The ONLY file that talks to localStorage. Every feature keeps its data
 * under its own key (prefixed to avoid clashes with other apps).
 */
const PREFIX = 'rmp:';

export const KEYS = {
  favorites: 'favorites',
  mealPlan: 'mealPlan',
  shoppingList: 'shoppingList',
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    // Let the rest of the app (e.g. nav badges) know something changed.
    window.dispatchEvent(new CustomEvent('app:storage', { detail: { key } }));
    return true;
  } catch {
    return false;
  }
}
