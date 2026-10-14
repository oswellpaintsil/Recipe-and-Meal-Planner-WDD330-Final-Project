/**
 * User Interface Module - reusable pieces of markup and small UI helpers.
 */
import { isFavorite, toggleFavorite } from '../modules/favorites.js';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Always escape text that comes from an API or the user before putting it in HTML. */
export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/* ---------- Status messages ---------- */

export function loadingState(message = 'Loading…') {
  return `<div class="state" role="status"><span class="spinner" aria-hidden="true"></span><p>${escapeHtml(message)}</p></div>`;
}

export function errorState(message, retryLabel = 'Try again') {
  return `<div class="state state-error" role="alert">
    <p><strong>Something went wrong.</strong></p>
    <p>${escapeHtml(message)}</p>
    <button type="button" class="btn" data-retry>${escapeHtml(retryLabel)}</button>
  </div>`;
}

export function emptyState(title, text = '', extraHtml = '') {
  return `<div class="state"><h2 class="h3">${escapeHtml(title)}</h2>${
    text ? `<p>${escapeHtml(text)}</p>` : ''
  }${extraHtml}</div>`;
}

/** Wires up the "Try again" button inside an error state. */
export function bindRetry(container, callback) {
  const button = container.querySelector('[data-retry]');
  if (button) button.addEventListener('click', callback);
}

/* ---------- Toast notifications ---------- */

export function showToast(message) {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const toast = document.createElement('p');
  toast.className = 'toast';
  toast.textContent = message;
  region.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ---------- Search form ---------- */

export function searchFormHtml({ id, query = '', type = 'name' } = {}) {
  return `<form class="search-form" role="search" data-search-form>
    <div class="field">
      <label for="${id}-q">Search recipes</label>
      <input id="${id}-q" name="q" type="search" required minlength="2"
        placeholder="e.g. lasagne, chicken, rice" value="${escapeHtml(query)}" />
    </div>
    <div class="field">
      <label for="${id}-type">Search by</label>
      <select id="${id}-type" name="type">
        <option value="name" ${type === 'name' ? 'selected' : ''}>Meal name</option>
        <option value="ingredient" ${type === 'ingredient' ? 'selected' : ''}>Ingredient</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Search</button>
  </form>`;
}

export function bindSearchForm(container) {
  const form = container.querySelector('[data-search-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const q = String(data.get('q')).trim();
    if (!q) return;
    window.location.hash = `#/search?q=${encodeURIComponent(q)}&type=${data.get('type')}`;
  });
}

/* ---------- Recipe cards ---------- */

export function recipeCard(meal, index = 0) {
  const saved = isFavorite(meal.id);
  const name = escapeHtml(meal.name);
  return `<article class="card recipe-card" style="--i:${index}">
    <a class="card-link" href="#/recipe/${encodeURIComponent(meal.id)}">
      <img src="${escapeHtml(meal.thumb)}/preview" alt="${name}" loading="lazy" width="250" height="250" />
      <h3>${name}</h3>
    </a>
    <button type="button" class="fav-btn" data-fav
      data-id="${escapeHtml(meal.id)}" data-name="${name}" data-thumb="${escapeHtml(meal.thumb)}"
      aria-label="${saved ? 'Remove from' : 'Save to'} favorites: ${name}">
      <span aria-hidden="true">${saved ? '♥' : '♡'}</span>
    </button>
  </article>`;
}

export function recipeGrid(meals) {
  return `<div class="grid">${meals.map((m, i) => recipeCard(m, i)).join('')}</div>`;
}

/**
 * One click listener handles every favorite button inside the container.
 * onChange(meal, isNowFavorite) lets a page react (e.g. the Favorites page).
 */
export function bindFavoriteButtons(container, onChange) {
  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav]');
    if (!button) return;

    const meal = {
      id: button.dataset.id,
      name: button.dataset.name,
      thumb: button.dataset.thumb,
    };
    const nowFavorite = toggleFavorite(meal);
    updateFavoriteButton(button, nowFavorite);
    showToast(nowFavorite ? `Saved "${meal.name}" to favorites` : `Removed "${meal.name}"`);
    if (onChange) onChange(meal, nowFavorite);
  });
}

function updateFavoriteButton(button, saved) {
  button.setAttribute(
    'aria-label',
    `${saved ? 'Remove from' : 'Save to'} favorites: ${button.dataset.name}`,
  );
  const icon = button.querySelector('span[aria-hidden]');
  if (icon) icon.textContent = saved ? '♥' : '♡';
  else if (button.dataset.text) button.textContent = saved ? 'Remove favorite' : 'Save favorite';
}
