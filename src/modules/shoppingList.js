/** Shopping list logic: add, tick off, remove and clear items. */
import { KEYS, load, save } from './storage.js';

function makeId() {
  return globalThis.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getItems() {
  const list = load(KEYS.shoppingList, []);
  return Array.isArray(list) ? list : [];
}

/**
 * Adds an item. If the same ingredient is already on the list, the
 * quantities are combined instead of creating a duplicate.
 * Returns 'added' or 'merged'.
 */
export function addItem({ name, measure = '' }) {
  const cleanName = name.trim();
  const cleanMeasure = measure.trim();
  const items = getItems();
  const existing = items.find((i) => i.name.toLowerCase() === cleanName.toLowerCase());

  if (existing) {
    if (cleanMeasure && !existing.measure.includes(cleanMeasure)) {
      existing.measure = existing.measure ? `${existing.measure} + ${cleanMeasure}` : cleanMeasure;
    }
    existing.checked = false;
    save(KEYS.shoppingList, items);
    return 'merged';
  }

  items.push({ id: makeId(), name: cleanName, measure: cleanMeasure, checked: false });
  save(KEYS.shoppingList, items);
  return 'added';
}

export function addItems(list) {
  return list.reduce(
    (counts, item) => {
      counts[addItem(item)] += 1;
      return counts;
    },
    { added: 0, merged: 0 },
  );
}

export function toggleItem(id) {
  const items = getItems().map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
  save(KEYS.shoppingList, items);
}

export function removeItem(id) {
  save(KEYS.shoppingList, getItems().filter((i) => i.id !== id));
}

export function clearChecked() {
  save(KEYS.shoppingList, getItems().filter((i) => !i.checked));
}

export function clearAll() {
  save(KEYS.shoppingList, []);
}
