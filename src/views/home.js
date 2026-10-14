import { getCategories, getRandomMeal } from '../api/mealdb.js';
import { getFavorites } from '../modules/favorites.js';
import { getItems } from '../modules/shoppingList.js';
import { getPlannedMealIds } from '../modules/mealPlanner.js';
import {
  bindFavoriteButtons,
  bindSearchForm,
  errorState,
  escapeHtml,
  loadingState,
  recipeGrid,
  searchFormHtml,
} from '../components/ui.js';

export async function homeView({ outlet, isCurrent }) {
  document.title = 'Recipe & Meal Planner';

  outlet.innerHTML = `
    <section class="hero">
      <h1>What are we cooking this week?</h1>
      <p>Find recipes by name or by the ingredients you already have, then plan your week.</p>
      ${searchFormHtml({ id: 'home' })}
      <button type="button" class="btn btn-accent" id="random-btn">Surprise me with a recipe</button>
      <p class="form-error" id="random-error" role="alert"></p>
    </section>

    <section aria-labelledby="quick-h" class="tiles">
      <h2 id="quick-h" class="visually-hidden">Your kitchen at a glance</h2>
      <a class="tile" href="#/favorites"><strong>${getFavorites().length}</strong><span>Favorite recipes</span></a>
      <a class="tile" href="#/planner"><strong>${getPlannedMealIds().length}</strong><span>Meals planned</span></a>
      <a class="tile" href="#/shopping"><strong>${getItems().length}</strong><span>Shopping items</span></a>
      <a class="tile" href="#/products"><strong>🔍</strong><span>Look up food products</span></a>
    </section>

    <section aria-labelledby="cats-h">
      <h2 id="cats-h">Browse by category</h2>
      <div id="home-cats">${loadingState('Loading categories…')}</div>
    </section>

    <section aria-labelledby="feat-h">
      <h2 id="feat-h">Recipe ideas for you</h2>
      <div id="home-featured">${loadingState('Finding recipes…')}</div>
    </section>`;

  bindSearchForm(outlet);

  outlet.querySelector('#random-btn').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const errorBox = outlet.querySelector('#random-error');
    errorBox.textContent = '';
    button.disabled = true;
    try {
      const meal = await getRandomMeal();
      if (meal) window.location.hash = `#/recipe/${meal.id}`;
    } catch (error) {
      errorBox.textContent = `Could not fetch a random recipe. ${error.message}`;
      button.disabled = false;
    }
  });

  const catsBox = outlet.querySelector('#home-cats');
  const featuredBox = outlet.querySelector('#home-featured');

  const [cats, featured] = await Promise.allSettled([
    getCategories(),
    Promise.all(Array.from({ length: 6 }, () => getRandomMeal())),
  ]);
  if (!isCurrent()) return;

  if (cats.status === 'fulfilled') {
    catsBox.innerHTML = `<ul class="chip-list">${cats.value
      .map(
        (c) =>
          `<li><a class="chip" href="#/categories/${encodeURIComponent(c.name)}">${escapeHtml(c.name)}</a></li>`,
      )
      .join('')}</ul>`;
  } else {
    catsBox.innerHTML = errorState(cats.reason.message);
    catsBox.querySelector('[data-retry]').addEventListener('click', () => homeView({ outlet, isCurrent }));
  }

  if (featured.status === 'fulfilled') {
    const unique = [...new Map(featured.value.filter(Boolean).map((m) => [m.id, m])).values()];
    featuredBox.innerHTML = recipeGrid(unique);
    bindFavoriteButtons(featuredBox);
  } else {
    featuredBox.innerHTML = errorState(featured.reason.message);
    featuredBox.querySelector('[data-retry]').addEventListener('click', () => homeView({ outlet, isCurrent }));
  }
}
