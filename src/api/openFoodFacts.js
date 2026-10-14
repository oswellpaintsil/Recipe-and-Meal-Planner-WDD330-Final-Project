/**
 * Food API Module - Open Food Facts.
 * https://openfoodfacts.github.io/openfoodfacts-server/api/
 */
import { fetchJson } from './http.js';

const BASE_URL = 'https://world.openfoodfacts.org';
const PAGE_SIZE = 12;

const FIELDS = [
  'code',
  'product_name',
  'brands',
  'quantity',
  'image_front_small_url',
  'image_front_url',
  'ingredients_text',
  'nutriscore_grade',
  'nutriments',
].join(',');

function normaliseProduct(raw) {
  const n = raw.nutriments || {};
  return {
    id: raw.code,
    name: (raw.product_name || '').trim(),
    brand: (raw.brands || '').split(',')[0].trim(),
    quantity: raw.quantity || '',
    thumb: raw.image_front_small_url || '',
    image: raw.image_front_url || raw.image_front_small_url || '',
    ingredients: raw.ingredients_text || '',
    nutriscore: (raw.nutriscore_grade || '').toLowerCase(),
    nutrition: {
      energy: n['energy-kcal_100g'],
      fat: n.fat_100g,
      saturatedFat: n['saturated-fat_100g'],
      carbs: n.carbohydrates_100g,
      sugars: n.sugars_100g,
      protein: n.proteins_100g,
      salt: n.salt_100g,
    },
  };
}

export async function searchProducts(term) {
  const params = new URLSearchParams({
    search_terms: term,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: String(PAGE_SIZE),
    fields: FIELDS,
  });

  const data = await fetchJson(`${BASE_URL}/cgi/search.pl?${params}`, { timeout: 20000 });
  return (data.products || []).map(normaliseProduct).filter((p) => p.name);
}
