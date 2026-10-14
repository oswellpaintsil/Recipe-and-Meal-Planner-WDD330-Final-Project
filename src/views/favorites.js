import { getFavorites } from '../modules/favorites.js';
import { bindFavoriteButtons, emptyState, recipeGrid } from '../components/ui.js';

export async function favoritesView({ outlet }) {
  document.title = 'Favorites · Recipe & Meal Planner';

  function render() {
    const favorites = getFavorites();
    outlet.innerHTML = `<h1>Your favorite recipes</h1>${
      favorites.length
        ? `<div id="fav-list">${recipeGrid(favorites)}</div>`
        : emptyState(
            'No favorites yet',
            'Tap the heart on any recipe to save it here.',
            '<p><a class="btn btn-primary" href="#/categories">Browse recipes</a></p>',
          )
    }`;

    const list = outlet.querySelector('#fav-list');
    if (list) {
      // Un-favoriting on this page removes the card, so redraw the list.
      bindFavoriteButtons(list, () => setTimeout(render, 250));
    }
  }
  render();
}
