/** Recipe Details Module - image, ingredients, instructions and actions. */
import { getMealById, INGREDIENT_IMG } from '../api/mealdb.js';
import { isFavorite } from '../modules/favorites.js';
import { DAYS, SLOTS, assignMeal } from '../modules/mealPlanner.js';
import { addItem, addItems } from '../modules/shoppingList.js';
import {
  bindFavoriteButtons,
  bindRetry,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  showToast,
} from '../components/ui.js';

/** Splits the instruction text into clean steps and drops lines like "STEP 1". */
function toSteps(text) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^(step\s*\d+|\d+\.?)$/i.test(line));
}

function template(meal) {
  const saved = isFavorite(meal.id);
  const name = escapeHtml(meal.name);
  const tags = [meal.category, meal.area, ...meal.tags].filter(Boolean);

  return `
    <article class="recipe">
      <p><button type="button" class="link-btn" data-back>← Back</button></p>

      <div class="recipe-header">
        <img class="recipe-img" src="${escapeHtml(meal.thumb)}" alt="${name}" width="500" height="500" />
        <div>
          <h1>${name}</h1>
          <ul class="chip-list">${tags.map((t) => `<li class="chip chip-static">${escapeHtml(t)}</li>`).join('')}</ul>

          <div class="actions">
            <button type="button" class="btn ${saved ? 'btn-accent' : ''}" data-fav data-text
              data-id="${escapeHtml(meal.id)}" data-name="${name}" data-thumb="${escapeHtml(meal.thumb)}">${saved ? 'Remove favorite' : 'Save favorite'}</button>
          </div>

          <form class="planner-form" data-planner-form>
            <h2 class="h3">Add to weekly planner</h2>
            <div class="field">
              <label for="plan-day">Day</label>
              <select id="plan-day" name="day">${DAYS.map((d) => `<option>${d}</option>`).join('')}</select>
            </div>
            <div class="field">
              <label for="plan-slot">Meal</label>
              <select id="plan-slot" name="slot">${SLOTS.map((s) => `<option>${s}</option>`).join('')}</select>
            </div>
            <button type="submit" class="btn btn-primary">Add to planner</button>
          </form>
        </div>
      </div>

      <div class="recipe-body">
        <section aria-labelledby="ing-h">
          <h2 id="ing-h">Ingredients</h2>
          <button type="button" class="btn btn-small" data-add-all>Add all to shopping list</button>
          <ul class="ingredient-list">
            ${meal.ingredients
              .map(
                (ing, i) => `<li>
                  <img src="${INGREDIENT_IMG}/${encodeURIComponent(ing.name)}-Small.png" alt="" width="40" height="40" loading="lazy" />
                  <span><strong>${escapeHtml(ing.measure)}</strong> ${escapeHtml(ing.name)}</span>
                  <button type="button" class="btn btn-small btn-outline" data-add-ing="${i}"
                    aria-label="Add ${escapeHtml(ing.name)} to shopping list">+ List</button>
                </li>`,
              )
              .join('')}
          </ul>
        </section>

        <section aria-labelledby="ins-h">
          <h2 id="ins-h">Instructions</h2>
          <ol class="steps">${toSteps(meal.instructions)
            .map((s) => `<li>${escapeHtml(s)}</li>`)
            .join('')}</ol>
          <p class="links">
            ${meal.youtube ? `<a href="${escapeHtml(meal.youtube)}" target="_blank" rel="noopener">Watch video tutorial</a>` : ''}
            ${meal.source ? `<a href="${escapeHtml(meal.source)}" target="_blank" rel="noopener">Original source</a>` : ''}
          </p>
        </section>
      </div>
    </article>`;
}

function bind(outlet, meal) {
  outlet.querySelector('[data-back]').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/';
  });

  bindFavoriteButtons(outlet, (_m, nowFavorite) => {
    const btn = outlet.querySelector('[data-fav]');
    btn.textContent = nowFavorite ? 'Remove favorite' : 'Save favorite';
    btn.classList.toggle('btn-accent', nowFavorite);
  });

  outlet.querySelector('[data-planner-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const day = data.get('day');
    const slot = data.get('slot');
    if (assignMeal(day, slot, meal)) showToast(`Added to ${day} ${slot.toLowerCase()}`);
    else showToast('Could not save the plan. Is browser storage full or blocked?');
  });

  outlet.querySelector('[data-add-all]').addEventListener('click', () => {
    const { added, merged } = addItems(meal.ingredients);
    showToast(`Shopping list updated: ${added} added, ${merged} combined`);
  });

  outlet.querySelectorAll('[data-add-ing]').forEach((button) => {
    button.addEventListener('click', () => {
      const ing = meal.ingredients[Number(button.dataset.addIng)];
      const result = addItem(ing);
      showToast(result === 'added' ? `Added ${ing.name} to your list` : `${ing.name} is already on your list`);
    });
  });
}

export async function recipeView({ params, outlet, isCurrent }) {
  async function load() {
    outlet.innerHTML = loadingState('Loading recipe…');
    try {
      const meal = await getMealById(params.id);
      if (!isCurrent()) return;
      if (!meal) {
        outlet.innerHTML = `<h1>Recipe not found</h1>${emptyState(
          'We could not find that recipe',
          '',
          '<p><a href="#/">Back to home</a></p>',
        )}`;
        return;
      }
      document.title = `${meal.name} · Recipe & Meal Planner`;
      outlet.innerHTML = template(meal);
      bind(outlet, meal);
    } catch (error) {
      if (!isCurrent()) return;
      outlet.innerHTML = `<h1>Recipe</h1>${errorState(error.message)}`;
      bindRetry(outlet, load);
    }
  }
  await load();
}
