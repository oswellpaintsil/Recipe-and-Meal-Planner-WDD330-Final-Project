import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';

import { route, startRouter } from './router.js';
import { getFavorites } from './modules/favorites.js';
import { getItems } from './modules/shoppingList.js';

import { homeView } from './views/home.js';
import { searchView } from './views/search.js';
import { categoriesView, categoryDetailView } from './views/categories.js';
import { recipeView } from './views/recipe.js';
import { favoritesView } from './views/favorites.js';
import { plannerView } from './views/planner.js';
import { shoppingView } from './views/shopping.js';
import { productsView } from './views/products.js';
import { notFoundView } from './views/notFound.js';

/* ---------- Routes ---------- */
route('/', homeView);
route('/search', searchView);
route('/categories', categoriesView);
route('/categories/:name', categoryDetailView);
route('/recipe/:id', recipeView);
route('/favorites', favoritesView);
route('/planner', plannerView);
route('/shopping', shoppingView);
route('/products', productsView);

/* ---------- Navigation badges ---------- */
function updateBadge(id, count) {
  const badge = document.getElementById(id);
  badge.textContent = count;
  badge.hidden = count === 0;
}

function updateBadges() {
  updateBadge('fav-count', getFavorites().length);
  updateBadge('shop-count', getItems().filter((i) => !i.checked).length);
}

window.addEventListener('app:storage', updateBadges);
updateBadges();

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

// Close the menu after choosing a link on small screens.
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
});

/* ---------- Start ---------- */
startRouter(document.getElementById('app'), notFoundView);
