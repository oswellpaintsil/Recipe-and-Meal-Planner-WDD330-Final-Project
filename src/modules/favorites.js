/** Favorites Module - save, retrieve and remove favorite recipes. */
import { KEYS, load, save } from './storage.js';

export function getFavorites() {
  const list = load(KEYS.favorites, []);
  return Array.isArray(list) ? list : [];
}

export function isFavorite(id) {
  return getFavorites().some((meal) => meal.id === id);
}

/** Adds the meal if it is not saved, removes it otherwise. Returns true if now a favorite. */
export function toggleFavorite(meal) {
  const favorites = getFavorites();
  const exists = favorites.some((m) => m.id === meal.id);

  const updated = exists
    ? favorites.filter((m) => m.id !== meal.id)
    : [...favorites, { id: meal.id, name: meal.name, thumb: meal.thumb }];

  save(KEYS.favorites, updated);
  return !exists;
}
