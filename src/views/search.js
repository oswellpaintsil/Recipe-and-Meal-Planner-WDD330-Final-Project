/** Search Module - search recipes by meal name or by a single ingredient. */
import { filterByIngredient, searchByName } from '../api/mealdb.js';
import {
  bindFavoriteButtons,
  bindRetry,
  bindSearchForm,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  recipeGrid,
  searchFormHtml,
} from '../components/ui.js';

export async function searchView({ query, outlet, isCurrent }) {
  const q = (query.get('q') || '').trim();
  const type = query.get('type') === 'ingredient' ? 'ingredient' : 'name';
  document.title = q ? `Search: ${q} · Recipe & Meal Planner` : 'Search · Recipe & Meal Planner';

  outlet.innerHTML = `
    <h1>Search recipes</h1>
    ${searchFormHtml({ id: 'page', query: q, type })}
    <div id="results" aria-live="polite"></div>`;
  bindSearchForm(outlet);

  const results = outlet.querySelector('#results');
  if (!q) {
    results.innerHTML = emptyState('Start searching', 'Type a meal name or an ingredient above.');
    return;
  }

  async function run() {
    results.innerHTML = loadingState(`Searching for "${q}"…`);
    try {
      const meals = type === 'ingredient' ? await filterByIngredient(q) : await searchByName(q);
      if (!isCurrent()) return;

      if (meals.length === 0) {
        results.innerHTML = emptyState(
          `No recipes found for "${q}"`,
          type === 'ingredient'
            ? 'Try a single ingredient such as chicken, salmon or potatoes.'
            : 'Check your spelling or try a shorter word.',
        );
        return;
      }

      results.innerHTML = `<p class="result-count">${meals.length} recipe${
        meals.length === 1 ? '' : 's'
      } found for <strong>${escapeHtml(q)}</strong></p>${recipeGrid(meals)}`;
      bindFavoriteButtons(results);
    } catch (error) {
      if (!isCurrent()) return;
      results.innerHTML = errorState(error.message);
      bindRetry(results, run);
    }
  }

  await run();
}
