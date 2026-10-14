/**
 * Recipe API Module - TheMealDB (free test key "1").
 * https://www.themealdb.com/api.php
 */
import { fetchJson } from './http.js';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
export const INGREDIENT_IMG = 'https://www.themealdb.com/images/ingredients';

/** Short version of a meal, used on recipe cards. */
function toSummary(raw) {
  return { id: raw.idMeal, name: raw.strMeal, thumb: raw.strMealThumb };
}

/** Full version of a meal, used on the details page. */
export function normaliseMeal(raw) {
  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = (raw[`strIngredient${i}`] || '').trim();
    const measure = (raw[`strMeasure${i}`] || '').trim();
    if (name) ingredients.push({ name, measure });
  }

  return {
    ...toSummary(raw),
    category: raw.strCategory || '',
    area: raw.strArea || '',
    instructions: raw.strInstructions || '',
    tags: raw.strTags ? raw.strTags.split(',').map((t) => t.trim()) : [],
    youtube: raw.strYoutube || '',
    source: raw.strSource || '',
    ingredients,
  };
}

export async function searchByName(query) {
  const data = await fetchJson(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  return (data.meals || []).map(toSummary);
}

export async function filterByIngredient(ingredient) {
  // The API expects underscores instead of spaces (e.g. "olive_oil").
  const formatted = ingredient.trim().toLowerCase().replace(/\s+/g, '_');
  const data = await fetchJson(`${BASE_URL}/filter.php?i=${encodeURIComponent(formatted)}`);
  return (data.meals || []).map(toSummary);
}

export async function getCategories() {
  const data = await fetchJson(`${BASE_URL}/categories.php`);
  return (data.categories || []).map((c) => ({
    id: c.idCategory,
    name: c.strCategory,
    thumb: c.strCategoryThumb,
    description: c.strCategoryDescription,
  }));
}

export async function filterByCategory(category) {
  const data = await fetchJson(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  return (data.meals || []).map(toSummary);
}

export async function getMealById(id) {
  const data = await fetchJson(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals && data.meals[0] ? normaliseMeal(data.meals[0]) : null;
}

export async function getRandomMeal() {
  const data = await fetchJson(`${BASE_URL}/random.php`);
  return data.meals && data.meals[0] ? normaliseMeal(data.meals[0]) : null;
}
