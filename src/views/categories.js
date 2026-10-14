import { filterByCategory, getCategories } from '../api/mealdb.js';
import {
  bindFavoriteButtons,
  bindRetry,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  recipeGrid,
} from '../components/ui.js';

/** List of all categories. */
export async function categoriesView({ outlet, isCurrent }) {
  document.title = 'Categories · Recipe & Meal Planner';
  outlet.innerHTML = `<h1>Recipe categories</h1><div id="cat-list"></div>`;
  const box = outlet.querySelector('#cat-list');

  async function load() {
    box.innerHTML = loadingState('Loading categories…');
    try {
      const categories = await getCategories();
      if (!isCurrent()) return;
      box.innerHTML = `<div class="grid grid-wide">${categories
        .map(
          (c, i) => `<article class="card category-card" style="--i:${i}">
            <a class="card-link" href="#/categories/${encodeURIComponent(c.name)}">
              <img src="${escapeHtml(c.thumb)}" alt="" loading="lazy" width="300" height="225" />
              <h2 class="h3">${escapeHtml(c.name)}</h2>
              <p>${escapeHtml(c.description.slice(0, 110))}…</p>
            </a>
          </article>`,
        )
        .join('')}</div>`;
    } catch (error) {
      if (!isCurrent()) return;
      box.innerHTML = errorState(error.message);
      bindRetry(box, load);
    }
  }
  await load();
}

/** Recipes inside one category. */
export async function categoryDetailView({ params, outlet, isCurrent }) {
  const name = params.name;
  document.title = `${name} recipes · Recipe & Meal Planner`;
  outlet.innerHTML = `
    <p><a href="#/categories">← All categories</a></p>
    <h1>${escapeHtml(name)} recipes</h1>
    <div id="cat-meals" aria-live="polite"></div>`;
  const box = outlet.querySelector('#cat-meals');

  async function load() {
    box.innerHTML = loadingState(`Loading ${name} recipes…`);
    try {
      const meals = await filterByCategory(name);
      if (!isCurrent()) return;
      if (meals.length === 0) {
        box.innerHTML = emptyState('No recipes in this category yet');
        return;
      }
      box.innerHTML = recipeGrid(meals);
      bindFavoriteButtons(box);
    } catch (error) {
      if (!isCurrent()) return;
      box.innerHTML = errorState(error.message);
      bindRetry(box, load);
    }
  }
  await load();
}
